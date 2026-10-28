#!/usr/bin/env python3
"""짐승 말고 **자리**를 돌려 본다.

숲 속 빈터 하나를 3차원으로 두고 네 방향에서 본다.
네 아이가 선 자리가 실제로 하나인지, 그림으로 그게 보이는지.
"""

import math
import os
import random
from PIL import Image, ImageDraw

W, H = 1000, 700
INK = "#1a1a1a"
THIN = "#1a1a1a"
OUT = os.path.dirname(os.path.abspath(__file__))

random.seed(7)


# ─── 빈터 하나 (3차원) ─────────────────────────────────────────
# x 오른쪽 · y 위 · z 앞쪽.  가운데 한 점이 원점.

EDGES = []


def seg(a, b):
    EDGES.append((a, b))


# 땅 — 빈터 둘레 원
R_CLEAR = 2.6
prev = None
for i in range(49):
    a = 2 * math.pi * i / 48
    p = (R_CLEAR * math.cos(a), 0, R_CLEAR * math.sin(a))
    if prev:
        seg(prev, p)
    prev = p

# 나무 — 둘레 바깥에 열둘. 자리는 고정이다
TREES = []
for i in range(12):
    a = 2 * math.pi * i / 12 + 0.26
    r = 3.5 + 1.1 * ((i * 7) % 5) / 4
    TREES.append((r * math.cos(a), r * math.sin(a), 1.5 + 0.8 * ((i * 3) % 4) / 3))
for (tx, tz, th) in TREES:
    seg((tx, 0, tz), (tx, th, tz))                     # 줄기
    for k in range(3):                                  # 가지 셋
        y = th * (0.55 + 0.17 * k)
        sp = 0.30 + 0.10 * k
        seg((tx, y, tz), (tx - sp, y + 0.22, tz - sp * 0.4))
        seg((tx, y, tz), (tx + sp, y + 0.20, tz + sp * 0.4))

# 물 — 왼쪽 앞의 웅덩이
PX, PZ, PR = -1.35, 1.15, 0.62
prev = None
for i in range(33):
    a = 2 * math.pi * i / 32
    p = (PX + PR * math.cos(a) * 1.25, 0, PZ + PR * math.sin(a) * 0.8)
    if prev:
        seg(prev, p)
    prev = p
for i in range(3):                                      # 물결 세 줄
    y = 0.0
    seg((PX - 0.38 + 0.1 * i, y, PZ - 0.18 + 0.16 * i),
        (PX + 0.30 + 0.1 * i, y, PZ - 0.18 + 0.16 * i))

# 발자국 — 네 방향에서 가운데로 들어오는 네 줄
for i in range(4):
    a = math.pi / 2 * i
    for k in range(5):
        t = 3.3 - k * 0.52
        bx, bz = t * math.cos(a), t * math.sin(a)
        off = 0.1 if k % 2 == 0 else -0.1
        px, pz = bx - off * math.sin(a), bz + off * math.cos(a)
        seg((px - 0.055, 0, pz - 0.035), (px + 0.055, 0, pz - 0.035))
        seg((px + 0.055, 0, pz - 0.035), (px + 0.055, 0, pz + 0.035))
        seg((px + 0.055, 0, pz + 0.035), (px - 0.055, 0, pz + 0.035))
        seg((px - 0.055, 0, pz + 0.035), (px - 0.055, 0, pz - 0.035))

# 가운데 — 선 자리 하나. 돌 한 덩이
for i in range(13):
    a = 2 * math.pi * i / 12
    b = 2 * math.pi * (i + 1) / 12
    seg((0.34 * math.cos(a), 0.0, 0.34 * math.sin(a)),
        (0.34 * math.cos(b), 0.0, 0.34 * math.sin(b)))
    seg((0.26 * math.cos(a), 0.19, 0.26 * math.sin(a)),
        (0.26 * math.cos(b), 0.19, 0.26 * math.sin(b)))
for i in range(6):
    a = 2 * math.pi * i / 6
    seg((0.34 * math.cos(a), 0.0, 0.34 * math.sin(a)),
        (0.26 * math.cos(a), 0.19, 0.26 * math.sin(a)))


# ─── 보는 자리 네 곳 ────────────────────────────────────────────

def camera(yaw_deg, pitch_deg):
    """yaw 로 돌리고 pitch 로 내려다본다."""
    ya, pa = math.radians(yaw_deg), math.radians(pitch_deg)

    def proj(p):
        x, y, z = p
        xr = x * math.cos(ya) - z * math.sin(ya)
        zr = x * math.sin(ya) + z * math.cos(ya)
        u = xr
        v = y * math.cos(pa) - zr * math.sin(pa)
        return (u, v)
    return proj


VIEWS = {
    "자리-1-앞":   camera(0, 16),
    "자리-2-뒤":   camera(180, 16),
    "자리-3-옆":   camera(90, 16),
    "자리-4-위":   camera(0, 74),
}


def render(name, proj):
    img = Image.new("RGB", (W, H), "#FBF7EF")
    d = ImageDraw.Draw(img)
    pts = [proj(p) for e in EDGES for p in e]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    s = min(W * 0.86 / (max(xs) - min(xs)), H * 0.86 / (max(ys) - min(ys)))

    def to(p):
        u, v = proj(p)
        return (W / 2 + (u - cx) * s, H / 2 - (v - cy) * s)

    for a, b in EDGES:
        d.line([to(a), to(b)], fill=INK, width=2)
    p = os.path.join(OUT, "%s.png" % name)
    img.save(p)
    return p


if __name__ == "__main__":
    for n, proj in VIEWS.items():
        print(render(n, proj))

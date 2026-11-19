# Smile Bank — 웃음 적립

카메라 앞에서 웃으면 그 시간이 **적립**되고, 적립이 크레딧이 되는 프로토타입입니다.
업로드해주신 `SmileAge_camera_version.html`을 바탕으로 두 가지를 작업했습니다.

| | 작업 | 결과 |
|---|---|---|
| 1 | "Smile Age"(나이 차감) 표현 제거 | 근거 없는 건강 주장 삭제, 게임 점수로 재정의 |
| 2 | MediaPipe 자체 호스팅 | 외부 요청 0건, 완전 오프라인 동작 |

---

## 1. 왜 "나이 차감"을 뺐는가

이전 버전의 홈 화면은 이렇게 말하고 있었습니다:

> *"Enter your current age. Every day you smile, days are subtracted from it."*
> → `46 y − 3.21 d`

**나이에서 날짜를 빼는 것은 수치가 붙은 건강 주장입니다.** 그런데 근거가 반대입니다.

- 얼굴을 젊어 보이게 만드는 것이 생물학적 나이를 낮춘다는 근거는 없습니다. FaceAge 연구도
  건강한 사람을 대상으로 검증된 측정 도구가 아닙니다.
- 오히려 웃으면 **약 1살 더 많게** 평가된다는 연구가 있습니다.
- 웃음과 생물학적 나이 변화를 연결하는 근거는 확인되지 않습니다.

하단에 "for fun" 면책 문구는 있었지만, **메인의 큰 숫자가 주장이고 면책은 작은 글씨**라
표시광고법이나 앱스토어 심사에서 방패가 되기 어렵습니다.

### 바꾼 방식 — 숫자는 그대로, 틀만 교체

| | 이전 | 지금 |
|---|---|---|
| 히어로 숫자 | `46 y − 3.21 d` | `3.21 days banked` |
| 설명 | "나이에서 빼드립니다" | "오늘 0.12일 적립" |
| 나이 입력 | 필수 (시작 전 차단) | **없음** |
| 결과 화면 | `−0.12 d · Smile Age` | `+0.12 d · Banked` |
| 면책 | 하단 작은 글씨 | 카드 안에 상시 노출 |

내부 데이터는 **한 줄도 건드리지 않았습니다.** 적립 계산식(`smileDays`), 크레딧 환산,
레벨 보너스, 연속 기록 모두 그대로입니다. `reducedDays` 필드명도 유지해서 이전 저장
데이터가 그대로 읽힙니다 — 의미만 "차감된 일수"에서 "적립된 일수"로 바뀝니다.

### 같이 사라진 것: 나이 수집

나이로 계산할 게 없어졌으므로 입력칸을 삭제했습니다. 부수 효과가 둘 있습니다.

- **개인정보 하나를 덜 받습니다.** 쓸 데 없는 항목을 받아두는 게 더 나쁩니다.
- **첫 실행 장벽이 사라집니다.** 이전에는 나이를 넣기 전까지 세션 시작이 막혔습니다.

> ⚠️ 다만 기존 `minAge: 13` 설정이 **연령 게이트 역할**도 하고 있었습니다. 지금은
> 앱스토어 연령 등급에만 의존합니다. 별도 13+ 확인 화면이 필요하다고 판단하시면
> 그건 의도적으로 다시 넣어야 하는 선택입니다 — 제가 임의로 판단할 문제는 아니라 남겨둡니다.

---

## 2. MediaPipe 자체 호스팅

이전에는 실행할 때마다 외부 CDN 세 곳을 호출했습니다.

```
cdn.jsdelivr.net  →  vision_bundle.mjs
cdn.jsdelivr.net  →  wasm 런타임
storage.googleapis.com  →  face_landmarker.task
```

지금은 전부 앱 안에 있습니다.

```
vendor/mediapipe/vision_bundle.mjs                 0.13 MB
vendor/mediapipe/wasm/vision_wasm_internal.*       9.19 MB   SIMD (최신 브라우저)
vendor/mediapipe/wasm/vision_wasm_nosimd_internal.* 9.06 MB  구형 폴백
models/face_landmarker.task                        3.58 MB
                                                  ─────────
                                                   약 22 MB
```

**예상보다 큽니다.** 처음에 모델 3.76MB만 생각했는데, WASM 런타임이 파일당 9MB였습니다.

### 용량을 줄이려면

`vision_wasm_nosimd_internal.*` 두 개(9MB)를 빼면 절반이 됩니다. 대신 WASM SIMD를
지원하지 않는 브라우저에서 **조용히 실패**합니다 — Safari 16.4 미만, 즉 iOS 16.3 이하가
해당됩니다. 아이폰 전용으로 최신 iOS만 받으실 거면 빼도 되지만, 기본값은 안전하게
둘 다 넣었습니다.

### 로딩 전략 (서비스워커 2단)

22MB를 전부 미리 받으면 첫 실행이 느려집니다. 카메라를 한 번도 안 쓸 수도 있고요.

- **앱 셸**(HTML·아이콘·매니페스트) → 설치 시 프리캐시 → 즉시 열림
- **face tracking 22MB** → 카메라 모드를 **처음 켤 때** 받고 캐시 → 그 후로는 오프라인

---

## 검증 결과

실제 브라우저(헤드리스 Chromium + DevTools Protocol)에서 확인했습니다.

```
기능/표현 테스트    PASS 17 / FAIL 0
오프라인 테스트     PASS  8 / FAIL 0
외부 호스트 요청    0건
런타임 예외         0건
```

**표현 변경이 제대로 됐는지:**
- 화면 어디에도 "Smile Age" 문구 없음
- `ageInput` 요소 없음 · "subtract/minus the days" 표현 없음
- 히어로 숫자가 `days banked` 형식
- 나이 없이 `canStart()` 통과

**기능이 보존됐는지 (가장 중요):**
- 입만 웃음(`smile 0.8, eye 0.0`) → **0점** ← 가짜 웃음 판별 그대로
- 진짜 웃음(`smile 0.8, eye 0.5`) → **1.5점** ← 보너스 그대로
- 일일 크레딧 상한 10개 · 100점 = 0.1일 적립 그대로

**오프라인:**
- 네트워크 차단 후에도 앱이 열리고, MediaPipe 모듈이 로드되고,
  모델 파일이 **3,758,596 바이트 그대로** 읽힙니다

---

## 실행 방법

```bash
cd smile-age
python3 -m http.server 8811
# http://localhost:8811
```

카메라는 **권한 + 보안 컨텍스트**(https:// 또는 localhost)가 필요합니다.
`file://`로 바로 열면 카메라 모드가 안 되고 데모 모드로 떨어집니다.

iOS Capacitor로 감싸실 때는 `Info.plist`에 `NSCameraUsageDescription`이 필요합니다
(SayAh 마이크 권한과 같은 절차). WKWebView의 `getUserMedia`는 iOS 14.3+부터 동작합니다.

## 파일 구성

```
smile-age/
  index.html              앱 전체
  manifest.json           PWA 설치 정보
  sw.js                   2단 오프라인 캐시
  vendor/mediapipe/       MediaPipe Tasks Vision 0.10.14 (출처는 VERSION.txt)
  models/                 face_landmarker.task
  icons/                  192/512/maskable/apple
  app-store-icon-1024.png 알파 채널 없음
```

## 아직 안 한 것

3번으로 말씀드렸던 **기부 연계 전면 배치**는 이번 작업에 포함하지 않았습니다.
현재 Shop 화면은 데모 상태이고, 화면에 *"no real donation is made yet"* 이라고
정직하게 적혀 있습니다. 실제 연결은 RoamRate에서 쓴 것과 같은
"등록된 기부 플랫폼으로 링크아웃" 방식이면 자금을 보관하지 않아 안전합니다.

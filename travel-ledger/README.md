# RoamRate · Currency Converter & Travel Budget

여행 중 현지 통화로 지출을 입력하면 자동으로 원화(또는 원하는 통화)로 환산해 오늘·이번 달 총 지출을 보여주는
설치형 웹 앱(PWA). English·한국어·中文·日本語·Tiếng Việt·ไทย·Bahasa Melayu·Bahasa Indonesia·Filipino·Español
10개 언어를 지원해 한국인뿐 아니라 다양한 국적의 여행자도 쓸 수 있다. 기본 언어는 English.

맨 위 **환율 계산기** 카드에서 통화 16종(원·달러·파운드·엔·위안·유로·호주달러·멕시코페소·
링깃·페소(필리핀)·바트·동·싱가포르달러·대만달러·홍콩달러·루피아) 중 아무 두 개나 골라 금액을 넣으면
"환율 설정"에 저장된 값 그대로 즉시 환산되어 보인다 — 지출 기록과 별개로 빠르게 환율만 확인할 때 쓴다.

`allowance-ledger/`(Claude Artifact용 프로토타입)의 후속작이며, 이 폴더는 GitHub Pages 등에 직접 배포해
실시간 환율 조회와 여러 기기 간 동기화까지 지원하는 "진짜 앱" 버전이다.

## 지금 바로 써보기 (백엔드 없이)

```
cd travel-ledger
python3 -m http.server 8000   # 또는 아무 정적 서버
```
브라우저에서 `http://localhost:8000` 접속. `firebase-config.js`를 채우지 않은 상태이므로
자동으로 "기기 저장 전용" 모드로 동작한다 — 즉시 쓸 수 있지만 기기 간 동기화는 안 된다.

## 1. 여러 기기 동기화 켜기 (Firebase, 무료)

1. https://console.firebase.google.com 에서 새 프로젝트 생성 (무료 Spark 요금제로 충분).
2. 왼쪽 메뉴 **빌드 > Firestore Database** → **데이터베이스 만들기** → 위치 선택 후 생성.
   - **규칙(Rules)** 탭에서 아래로 교체 후 게시:
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /codes/{code}/{document=**} {
           allow read, write: if true;
         }
         match /feedback/{id} {
           allow create: if true;
           allow read, update, delete: if false;
         }
         match /analytics/{id} {
           allow read, write: if true;
         }
       }
     }
     ```
   - ⚠️ 이 규칙은 로그인 없이 "동기화 코드"만으로 접근하는 대신, **코드를 아는 사람은 누구나 읽고 쓸 수 있다.**
     가족 여행처럼 낮은 민감도의 개인 지출 기록에 적합한 트레이드오프다. 코드는 비밀번호처럼 관리할 것.
3. **프로젝트 설정(톱니바퀴) > 일반** 탭에서 "내 앱 추가 > 웹(`</>`)" 선택, 앱 등록.
4. 나오는 `firebaseConfig` 객체 값을 그대로 이 폴더의 `firebase-config.js`에 붙여넣기.
   (이 값들은 비밀키가 아니다 — 실제 접근 통제는 2번의 Firestore 규칙이 담당한다.)
5. 앱을 다시 열면 "기기 간 동기화" 카드에서 원하는 코드(예: `johan-family-2026`)를 입력하고 연결.
   같은 코드를 다른 기기에 입력하면 실시간으로 기록이 공유된다.

## 2. 실시간 환율

"환율 설정" 카드의 **"실시간 환율 불러오기"** 버튼은 무료 공개 API인
[Frankfurter](https://frankfurter.dev/)(유럽중앙은행 공시 환율 기준)에서 대부분의 통화를 한 번에 가져온다.
다만 이 API가 **베트남 동(VND)·대만 달러(TWD)는 지원하지 않아** 이 두 통화는 항상 수동 입력만 가능하다
(통화 옆 "확인" 버튼으로 검색 결과를 열어 빠르게 옮겨 적을 수 있음).

네트워크가 이 API를 차단하는 환경(중국 등 일부 국가)에서는 자동 조회가 실패할 수 있으며,
이 경우도 수동 입력으로 자연히 대체된다.

## 3. 시간 · 날씨

환율 계산기 아래 "Time & Weather" 카드는 [Open-Meteo](https://open-meteo.com/)(무료, API 키 불필요)로
도시 이름만 입력하면 좌표·시간대를 찾아 우리나라/여행지 시계 두 개와 여행지 현재 기온·날씨를 보여준다.
"현재 위치 사용" 버튼은 브라우저 위치 권한으로 지금 있는 곳을 그대로 여행지로 설정한다.
우리나라 시계는 도시를 따로 입력하지 않으면 기기의 시간대를 자동으로 쓴다.
도시·좌표는 기기에만 저장되며(로그인·동기화 코드와 무관), 날씨 API도 네트워크가 막히면
자동으로 오류 메시지만 뜨고 나머지 기능에는 영향이 없다.

## 4. iOS / Android에 "앱처럼" 설치하기

정식 배포(GitHub Pages 등 HTTPS 필요) 후:

- **Android (Chrome)**: 사이트 접속 → 주소창 옆 "설치" 아이콘 또는 메뉴의 "앱 설치".
- **iOS (Safari)**: 사이트 접속 → 공유 버튼 → "홈 화면에 추가".

홈 화면 아이콘으로 실행되며, 오프라인에서도 지금까지 입력한 기록을 볼 수 있다(서비스 워커가 앱 껍데기를 캐시).
앱스토어/플레이스토어에 정식 등록하려면 Capacitor 등으로 이 폴더를 감싸 네이티브 빌드를 만들어야 하며,
Apple Developer(연 $99)·Google Play(1회 $25) 계정과 심사가 추가로 필요하다.

## GitHub Pages로 배포하기

`.github/workflows/deploy-roamrate.yml`이 이미 준비되어 있다 — 이 브랜치에 `travel-ledger/`
변경사항을 푸시할 때마다 자동으로 배포된다. 딱 한 번, 저장소 Settings에서 켜야 한다:

1. https://github.com/&lt;owner&gt;/&lt;repo&gt;/settings/pages 접속.
2. **Build and deployment → Source**를 "GitHub Actions"로 변경 후 저장.
3. Actions 탭에서 `deploy-roamrate` 워크플로를 한 번 재실행(Re-run)하면 배포가 완료되고,
   `https://<사용자>.github.io/<저장소>/` 주소가 실제 서비스 URL이 된다.
4. 이 주소를 아무 브라우저에서 열어 "홈 화면에 추가"하면 다른 사람도 설치할 수 있다.

## 5. 피드백 받기 / 사용량 보기

"피드백 보내기" 카드에 사용자가 남긴 내용은 Firestore의 `feedback` 컬렉션에 쌓인다.
Firebase 콘솔 → Firestore Database → `feedback`에서 바로 읽을 수 있다 (앱에서는 다시
읽을 수 없도록 규칙을 걸어뒀다 — 남이 쓴 피드백을 다른 사용자가 볼 수 없게 하기 위함).

앱을 연 횟수·기록 추가 횟수 같은 익명 집계는 `analytics/summary` 문서 하나에 카운터로
쌓인다 (개인정보·제3자 분석 SDK 없이, 숫자만). 사용량을 보려면 Firestore Database →
`analytics` → `summary` 문서를 열면 된다.

## 6. 수익화 — 여기부터는 직접 계정을 만들어야 한다

앱 코드는 무료 배포·피드백·사용량 확인까지 전부 준비되어 있지만, **실제 수익이 발생하려면
아래 계정들은 본인 명의로 직접 가입해야 한다** (신원·결제 정보가 필요해 대신 만들어줄 수 없다):

- **제휴(어필리에이트) 링크** — Wise(환전), 여행자보험, eSIM 판매처 등의 제휴 프로그램에 가입하면
  전용 추적 링크를 받는다. 이 링크를 분류별 지출 화면에 붙이면 각 서비스의 자체 대시보드에서
  클릭·전환·수익을 볼 수 있다.
- **광고(AdMob)** — 스토어 앱으로 만든 뒤 Google AdMob 계정을 만들면 광고 수익이 AdMob
  대시보드에 표시된다.
- **인앱결제(Pro)** — Apple/Google 개발자 계정에 결제 정보를 등록해야 매출이 잡힌다.

즉 "얼마나 버는지"는 이 앱이 아니라 **가입한 제휴사·AdMob·스토어 콘솔의 대시보드**에서
확인하게 된다 — 계정을 만들고 나면 그 대시보드 링크와 확인 방법을 이어서 정리해줄 수 있다.

## 폴더 구조

```
travel-ledger/
  index.html           앱 전체 (UI + 10개 언어 문자열 + 로직, 의존성은 CDN의 Firebase SDK뿐)
  firebase-config.js    Firebase 프로젝트 설정값 (직접 채워 넣는 파일, 비밀 아님)
  manifest.json         PWA 설치 정보 (이름, 아이콘, 색상)
  sw.js                 오프라인 캐시용 서비스 워커
  privacy.html          개인정보처리방침 (App Store Connect 제출용)
  icons/                앱 아이콘 (any/maskable/apple 용도별)

mobile/                 iOS/Android 네이티브 래퍼 (Capacitor) — 별도 README 참고
```

## 분류(카테고리)

여행 지출에 맞춰 구성: 식비 · 간식/음료 · 교통비 · 숙박 · 쇼핑 · 선물 · 관광/입장료 · 액티비티/투어 ·
통신비 · 보험/의료 · 기타. (기존 "문구/학용품", "저축"은 여행 맥락과 거리가 있어 제외했다.)

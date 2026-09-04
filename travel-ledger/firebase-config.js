/*
  Firebase 프로젝트를 만든 뒤(README.md 참고), 콘솔 > 프로젝트 설정 > 일반 탭에서
  "SDK 설정 및 구성" 값을 그대로 복사해 아래 객체를 채우세요.
  이 값들은 비밀키가 아닙니다 — Firestore 보안 규칙이 실제 접근을 통제합니다.

  아래 값을 채우지 않고 그대로 두면(placeholder 상태) 앱은 자동으로
  "기기 저장 전용" 모드로 동작합니다 — 즉시 사용은 가능하지만 기기 간 동기화는 안 됩니다.
*/
window.TRAVEL_LEDGER_FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const pptxgen = require("pptxgenjs");
const { applyTheme } = require("/root/.claude/skills/synced/70e34ac1-700f-4b78-b9d2-397208412402_e9f8740d-29ab-4473-9d7e-2d8fff3eb332/pptx/scripts/apply_theme.js");

const THEME = {
  name: "Integrated Support Center", headFontFace: "Malgun Gothic", bodyFontFace: "Malgun Gothic",
  colors: { dk1:"16202E", lt1:"FFFFFF", dk2:"1B3A6B", lt2:"ECEFF4",
    accent1:"1B3A6B", accent2:"0F6457", accent3:"8A5A14", accent4:"45B49E",
    accent5:"9E3F23", accent6:"6A7585", hlink:"1B3A6B", folHlink:"6A7585" }
};
const NAVY="1B3A6B", TEAL="0F6457", GOLD="8A5A14", INK="16202E", MUTED="6A7585",
      LINE="D5DAE2", WHITE="FFFFFF", LT="ECEFF4", TLT="E0EEEA", GLT="F5EADA", WARN="9E3F23";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.author = "통합 지원센터";
pres.title = "통합 지원센터 사업 구조";

pres.defineSlideMaster({ title:"TITLE_DARK", background:{ color:NAVY }, objects:[
  { text:{ text:"INTEGRATED SUPPORT CENTER", options:{ x:0.9,y:1.6,w:8,h:0.35,fontSize:12,
    color:WHITE,charSpacing:4,transparency:25,isTextBox:true } } },
  { placeholder:{ options:{ name:"title", type:"title", x:0.9,y:2.05,w:11.5,h:1.25,
    fontSize:44,bold:true,color:WHITE }, text:" " } },
  { placeholder:{ options:{ name:"body", type:"body", x:0.9,y:3.45,w:10,h:0.9,
    fontSize:20,color:WHITE,align:"left" }, text:" " } } ]});

pres.defineSlideMaster({ title:"SECTION", background:{ color:NAVY }, objects:[
  { placeholder:{ options:{ name:"body", type:"body", x:0.9,y:2.7,w:4,h:0.5,
    fontSize:14,color:WHITE,charSpacing:3 }, text:" " } },
  { placeholder:{ options:{ name:"title", type:"title", x:0.9,y:3.2,w:11.5,h:1.1,
    fontSize:40,bold:true,color:WHITE }, text:" " } } ]});

pres.defineSlideMaster({ title:"CONTENT", background:{ color:WHITE }, objects:[
  { placeholder:{ options:{ name:"title", type:"title", x:0.75,y:0.45,w:11.8,h:0.85,
    fontSize:33,bold:true,color:INK,align:"left" }, text:" " } },
  { text:{ text:"통합 지원센터", options:{ x:0.75,y:6.85,w:4,h:0.3,fontSize:10,color:MUTED,isTextBox:true } } } ],
  slideNumber:{ x:12.4,y:6.85,fontSize:10,color:MUTED } });

pres.defineSlideMaster({ title:"CLOSING", background:{ color:NAVY }, objects:[
  { placeholder:{ options:{ name:"title", type:"title", x:0.9,y:1.5,w:11.5,h:1.1,
    fontSize:40,bold:true,color:WHITE }, text:" " } } ]});

const S=(m,sec)=>pres.addSlide({ masterName:m, sectionTitle:sec });
function card(s,o){ s.addShape(pres.ShapeType.roundRect,{ x:o.x,y:o.y,w:o.w,h:o.h,rectRadius:0.06,
  fill:{color:o.fill||WHITE}, line:{color:o.line||LINE, width:o.lw||1}, objectName:o.name }); }
function chip(s,{x,y,n,color}){ s.addShape(pres.ShapeType.ellipse,{x,y,w:0.4,h:0.4,fill:{color}});
  s.addText(String(n),{x,y,w:0.4,h:0.4,fontSize:13,bold:true,color:WHITE,align:"center",valign:"middle",margin:0,isTextBox:true}); }
function t(s,txt,o){ s.addText(txt, Object.assign({margin:0,isTextBox:true}, o)); }

/* 1 */
pres.addSection({ title:"개요" });
let s=S("TITLE_DARK","개요");
s.addText("통합 지원센터",{placeholder:"title"});
s.addText("세 개의 센터가 하나의 토대 위에 선다 — 학원 · 유학 · 비즈니스",{placeholder:"body"});
t(s,"3 센터 · 10 카테고리   ·   사업 구조 v2.0",{x:0.9,y:5.6,w:11.5,h:0.4,fontSize:14,color:WHITE,transparency:20});
s.addNotes("첫 장에서 '세 개를 동시에 한다'로 들리지 않게 한다. 구조는 셋이지만 지금 여는 것은 둘이라고 뒤에서 말한다.");

/* 2 한 장 요약 */
s=S("CONTENT","개요");
s.addText("한 장으로 보는 구조",{placeholder:"title"});
const cols=[
  { c:NAVY, lt:LT, p:"PART 1", n:"학원지원센터", who:"고객 · 학원 · 교회",
    items:["어학캠프","홍보","관리 시스템"] },
  { c:TEAL, lt:TLT, p:"PART 2", n:"유학지원센터", who:"고객 · 학부모 · 학생",
    items:["유학 설명 · 한국","유학 지원 · 현지","말레이시아 & 싱가포르"] },
  { c:GOLD, lt:GLT, p:"PART 3", n:"비즈니스지원센터", who:"프랜차이즈",
    items:["IT 비즈니스","출판","리크루팅 · 교육","한글 플랫폼"] }];
cols.forEach((col,i)=>{
  const x=0.75+i*4.05;
  s.addShape(pres.ShapeType.roundRect,{x,y:1.5,w:3.75,h:0.78,rectRadius:0.06,fill:{color:col.c},objectName:`band-${i}`});
  t(s,col.p,{x:x+0.25,y:1.62,w:3.2,h:0.26,fontSize:11,color:WHITE,transparency:20});
  t(s,col.n,{x:x+0.25,y:1.86,w:3.2,h:0.36,fontSize:18,bold:true,color:WHITE});
  t(s,col.who,{x:x+0.25,y:2.38,w:3.4,h:0.3,fontSize:11.5,color:MUTED});
  col.items.forEach((it,j)=>{
    const y=2.8+j*0.82;
    card(s,{x,y,w:3.75,h:0.68,fill:(i===2&&j===3)?GLT:WHITE,line:(i===2&&j===3)?GOLD:LINE,
      lw:(i===2&&j===3)?2:1,name:`c-${i}-${j}`});
    t(s,String(j+1).padStart(2,"0"),{x:x+0.22,y:y+0.2,w:0.45,h:0.3,fontSize:11,bold:true,color:col.c});
    t(s,it,{x:x+0.78,y:y+0.16,w:2.85,h:0.36,fontSize:15,bold:true,color:INK});
  });
});
card(s,{x:0.75,y:6.1,w:11.85,h:0.62,fill:LT,name:"found"});
t(s,"공통 토대 — 교육부 인가 어학원 · 학생비자 발급 권한 · 현지 네트워크",
  {x:1.05,y:6.25,w:11.3,h:0.35,fontSize:15,bold:true,color:NAVY});
s.addNotes("표를 읽지 말고 '고객이 다르다'는 점만 말한다. 학원에 파는 것, 학부모에게 파는 것, 창업자에게 파는 것.");

/* 3 이어지는 방식 */
s=S("CONTENT","개요");
s.addText("세 센터는 이렇게 이어진다",{placeholder:"title"});
const flow=[["Part 1","입구","캠프로 학생과 학부모를 만난다",NAVY],
            ["Part 2","전환","현지를 아는 학부모가 유학을 결정한다",TEAL],
            ["Part 3","복제","학원이 늘면 교재 · 시스템 · 교사가 팔린다",GOLD]];
flow.forEach((f,i)=>{
  const x=0.75+i*4.2;
  card(s,{x,y:1.8,w:3.6,h:2.6,fill:WHITE,line:f[3],lw:2,name:`flow-${i}`});
  t(s,f[0],{x:x+0.3,y:2.05,w:3.0,h:0.3,fontSize:12,bold:true,color:f[3]});
  t(s,f[1],{x:x+0.3,y:2.45,w:3.0,h:0.6,fontSize:30,bold:true,color:INK});
  t(s,f[2],{x:x+0.3,y:3.2,w:3.0,h:0.9,fontSize:13.5,color:MUTED});
  if(i<2) s.addShape(pres.ShapeType.rightArrow,{x:x+3.7,y:3.0,w:0.32,h:0.26,fill:{color:MUTED}});
});
card(s,{x:0.75,y:4.75,w:11.85,h:1.6,fill:LT,name:"loop"});
t(s,"캠프로 만난 학생이 유학생이 되고, 유학 수요가 학원을 늘린다",
  {x:1.1,y:5.0,w:11.2,h:0.45,fontSize:20,bold:true,color:NAVY});
t(s,"같은 가족을 두 번 세 번 만나는 구조입니다. 새 고객을 계속 찾는 사업보다 비용이 훨씬 적게 듭니다.",
  {x:1.1,y:5.5,w:11.2,h:0.6,fontSize:14,color:INK});
s.addNotes("이 장이 기획의 핵심 논리다. 세 사업이 따로가 아니라 한 고객을 공유한다.");

/* 4 토대 */
s=S("CONTENT","개요");
s.addText("토대 — 돈으로 살 수 없는 것",{placeholder:"title"});
card(s,{x:0.75,y:1.6,w:11.85,h:1.5,fill:NAVY,line:NAVY,name:"moat"});
t(s,"교육부 인가 어학원 · 학생비자 발급 권한",{x:1.15,y:1.95,w:11,h:0.55,fontSize:26,bold:true,color:WHITE});
t(s,"교재도 시스템도 광고도 돈으로 살 수 있습니다. 이것만은 못 삽니다.",
  {x:1.15,y:2.55,w:11,h:0.4,fontSize:15,color:WHITE,transparency:12});
[["교사 공급","사람을 데려와 합법적으로 체류시키며 기를 수 있다"],
 ["캠프 장기화","3개월을 넘는 프로그램도 설계할 수 있다"],
 ["가맹 유인","학원이 가장 아쉬워하는 것이 교사다. 본부가 보내 준다면 연회비는 싸다"]].forEach((v,i)=>{
  const x=0.75+i*4.05;
  card(s,{x,y:3.35,w:3.75,h:2.0,fill:WHITE,line:LINE,name:`moat-${i}`});
  chip(s,{x:x+0.3,y:3.6,n:i+1,color:NAVY});
  t(s,v[0],{x:x+0.3,y:4.15,w:3.2,h:0.4,fontSize:18,bold:true,color:INK});
  t(s,v[1],{x:x+0.3,y:4.6,w:3.2,h:0.7,fontSize:13,color:MUTED});
});
t(s,"다만 학생비자 상태의 인턴십이 근로에 해당하는지는 착수 전 자문이 필요합니다",
  {x:0.75,y:5.6,w:11.85,h:0.4,fontSize:14,bold:true,color:WARN});
s.addNotes("자랑과 경고를 한 장에 같이 둔다. 이게 솔직한 기획서로 보이게 만든다.");

/* 5 SECTION 1 */
pres.addSection({ title:"Part 1 학원지원센터" });
s=S("SECTION","Part 1 학원지원센터");
s.addText("PART 1",{placeholder:"body"}); s.addText("학원지원센터",{placeholder:"title"});
t(s,"어학캠프 · 홍보 · 관리 시스템",{x:0.9,y:4.4,w:11.5,h:0.4,fontSize:16,color:WHITE,transparency:20});

/* 6 캠프 */
s=S("CONTENT","Part 1 학원지원센터");
s.addText("어학캠프 — 세 가지 상품",{placeholder:"title"});
s.addTable([
  [{text:"구분",options:{bold:true}},{text:"A · 말·싱 (IM 선교회)",options:{bold:true}},
   {text:"B · 말·싱 (한국 학원)",options:{bold:true}},{text:"C · 미국 (IM 선교회)",options:{bold:true}}],
  ["대상","선교회 · 교회 자녀","초 · 중 · 고 일반","중 · 고"],
  ["모객","교회 · 선교 네트워크","한국 학원 제휴","교회 + 설명회"],
  ["가격대","낮게 (실비 중심)","450만원대","높음"],
  ["프로그램","어학 + 신앙 + 봉사","어학 + 한국 수학 + 대학 탐방","어학 + 미국 문화"],
  ["운영","우리 + 현지 어학원","우리 + 현지 어학원","IM USA 현지 운영"],
  ["수익","실비 + 소액 마진","1인 마진 약 161만원","송출 수수료"]
],{x:0.75,y:1.5,w:11.85,colW:[1.6,3.3,3.6,3.35],fontSize:13,color:INK,
   border:{type:"solid",color:LINE,pt:1},align:"left",valign:"middle",rowH:0.38,
   fill:{color:WHITE},fontFace:"Malgun Gothic"});
card(s,{x:0.75,y:4.5,w:11.85,h:1.75,fill:WHITE,line:WARN,name:"camp-note"});
t(s,"A와 B는 기수를 분리합니다",{x:1.1,y:4.75,w:11.2,h:0.4,fontSize:19,bold:true,color:WARN});
t(s,"섞으면 둘 다 잃습니다. 교회 학부모는 “왜 이렇게 비싸냐”, 일반 학부모는 “왜 예배를 드리냐”고 합니다.\n다만 현지 운영 · 숙소 · 교재는 공유해 원가를 낮춥니다.",
  {x:1.1,y:5.2,w:11.2,h:0.85,fontSize:14,color:INK});
s.addNotes("B(한국 학원 연계)가 현금이 가장 빨리 도는 상품. 연계 학원 3곳이면 모객 문제는 끝난다.");

/* 7 홍보 */
s=S("CONTENT","Part 1 학원지원센터");
s.addText("홍보 — 채널마다 역할이 다르다",{placeholder:"title"});
const ch=[["홈페이지","허브 · 신뢰의 근거","문의 폼 전환율"],["블로그","검색 유입","상위 노출 키워드"],
          ["인스타그램","굴러간다는 증거","DM 문의 수"],["유튜브","긴 설득","시청 지속시간"],
          ["숏츠 · 릴스","모르는 사람에게 도달","조회수 · 저장"]];
ch.forEach((c,i)=>{
  const y=1.55+i*0.85;
  t(s,c[0],{x:0.8,y:y,w:2.5,h:0.4,fontSize:17,bold:true,color:NAVY});
  t(s,c[1],{x:3.5,y:y+0.03,w:5.2,h:0.4,fontSize:14,color:INK});
  t(s,c[2],{x:8.9,y:y+0.05,w:3.6,h:0.35,fontSize:12.5,color:MUTED});
  if(i<4) s.addShape(pres.ShapeType.line,{x:0.8,y:y+0.68,w:11.7,h:0,line:{color:LINE,width:1}});
});
card(s,{x:0.75,y:5.9,w:11.85,h:0.95,fill:LT,name:"kpi"});
t(s,"KPI는 팔로워가 아니라 문의 수입니다 — 팔로워 1만 명보다 월 문의 20건이 낫습니다",
  {x:1.1,y:6.15,w:11.2,h:0.45,fontSize:16,bold:true,color:NAVY});
s.addNotes("주간 리듬은 월 소재선정 / 화·목 촬영 / 수 블로그 / 금 숏츠. 유튜브는 월 2편으로 시작.");

/* 8 시스템 */
s=S("CONTENT","Part 1 학원지원센터");
s.addText("관리 시스템 — 설치 없는 온라인 서비스",{placeholder:"title"});
[["1단계","출결 + 학부모 자동 알림 + 학생 마스터","4~6주",true],
 ["2단계","수납 · 미납 + 성적 이력 + 월말 리포트 자동화","6~8주",false],
 ["3단계","캠프 운영 모듈 + 강사 시수 · 급여 + 본부 대시보드","8~10주",false]].forEach((v,i)=>{
  const y=1.6+i*1.25;
  card(s,{x:0.75,y,w:11.85,h:1.05,fill:v[3]?LT:WHITE,line:v[3]?NAVY:LINE,lw:v[3]?2:1,name:`sys-${i}`});
  t(s,v[0],{x:1.1,y:y+0.3,w:1.5,h:0.45,fontSize:18,bold:true,color:NAVY});
  t(s,v[1],{x:2.7,y:y+0.32,w:7.8,h:0.45,fontSize:15,color:INK});
  t(s,v[2],{x:10.7,y:y+0.33,w:1.6,h:0.4,fontSize:14,color:MUTED,align:"right"});
});
card(s,{x:0.75,y:5.45,w:11.85,h:1.3,fill:WHITE,line:NAVY,name:"camp-mod"});
t(s,"차별점은 캠프 운영 모듈입니다",{x:1.1,y:5.65,w:11.2,h:0.4,fontSize:18,bold:true,color:NAVY});
t(s,"여권 정보 · 숙소 배정 · 투약 기록 · 액티비티 출결 · 일일 사진 전송 — 캠프를 해 본 사람만 만들 수 있는 기능입니다.",
  {x:1.1,y:6.08,w:11.2,h:0.5,fontSize:14,color:INK});
s.addNotes("1단계는 무료 시범으로 연다. 쓰게 만드는 것이 파는 것보다 먼저다.");

/* 9 SECTION 2 */
pres.addSection({ title:"Part 2 유학지원센터" });
s=S("SECTION","Part 2 유학지원센터"); s.background={ color:TEAL };
s.addText("PART 2",{placeholder:"body"}); s.addText("유학지원센터",{placeholder:"title"});
t(s,"Part 1이 만든 신뢰를 돈으로 바꾸는 곳",{x:0.9,y:4.4,w:11.5,h:0.4,fontSize:16,color:WHITE,transparency:20});

/* 10 설명회 */
s=S("CONTENT","Part 2 유학지원센터");
s.addText("유학 설명회 — 100명을 만나야 3~5명이 간다",{placeholder:"title"});
const fun=[["설명회 참석","100명",7.8],["개별 상담","30명",4.7],["현지 탐방","10명",2.5],["실제 유학","3~5명",1.5]];
fun.forEach((f,i)=>{
  const y=1.65+i*1.0;
  t(s,f[0],{x:0.75,y:y+0.17,w:2.05,h:0.4,fontSize:15.5,bold:true,color:INK,align:"right"});
  s.addShape(pres.ShapeType.roundRect,{x:3.0,y,w:f[2],h:0.72,rectRadius:0.06,
    fill:{color:i===3?TEAL:TLT},objectName:`fun-${i}`});
  t(s,f[1],{x:3.0+f[2]+0.22,y:y+0.17,w:1.7,h:0.4,fontSize:17,bold:true,color:i===3?TEAL:MUTED});
});
card(s,{x:0.75,y:5.75,w:11.85,h:1.0,fill:WHITE,line:TEAL,name:"semi"});
t(s,"설명회 90분의 심장은 0:30–0:50 — 비용 구조입니다. 학부모는 “얼마 드나”를 들으러 옵니다.",
  {x:1.1,y:6.0,w:11.2,h:0.5,fontSize:15.5,bold:true,color:TEAL});
s.addNotes("전환율을 미리 알고 시작해야 첫 설명회에서 실망하지 않는다. 자료집 10쪽은 이미 만들어져 있다.");

/* 11 유학 지원 */
s=S("CONTENT","Part 2 유학지원센터");
s.addText("유학 지원 — 7단계와 수수료",{placeholder:"title"});
const st7=["사전 상담","학교 탐방 투어","입학 상담 동행","서류 지원","학생비자 동행","정착 지원","사후 관리"];
st7.forEach((v,i)=>{
  const col=i%4,row=Math.floor(i/4);
  const x=0.75+col*3.05,y=1.6+row*1.45;
  const hot=(i===1||i===4);
  card(s,{x,y,w:2.8,h:1.15,fill:hot?TLT:WHITE,line:hot?TEAL:LINE,lw:hot?2:1,name:`st-${i}`});
  t(s,String(i+1).padStart(2,"0"),{x:x+0.25,y:y+0.17,w:2.3,h:0.3,fontSize:11.5,bold:true,color:TEAL});
  t(s,v,{x:x+0.25,y:y+0.52,w:2.3,h:0.45,fontSize:15,bold:true,color:INK});
});
s.addTable([
  [{text:"수수료 가안",options:{bold:true}},{text:"금액 (RM)",options:{bold:true}}],
  ["학교 탐방 투어 (3박4일, 1가족)","2,500"],
  ["입학 지원 패키지 (1~5단계)","6,000"],
  ["정착 지원","2,500"],
  ["사후 관리 (연)","1,200"]
],{x:0.75,y:4.6,w:6.0,colW:[4.4,1.6],fontSize:13,color:INK,border:{type:"solid",color:LINE,pt:1},
   align:"left",valign:"middle",rowH:0.36,fill:{color:WHITE},fontFace:"Malgun Gothic"});
card(s,{x:7.1,y:4.6,w:5.5,h:1.8,fill:WHITE,line:WARN,name:"fee-note"});
t(s,"소개 수수료는 먼저 밝힙니다",{x:7.45,y:4.82,w:4.9,h:0.4,fontSize:16,bold:true,color:WARN});
t(s,"학교로부터 커미션을 받는 경우 학부모에게 사전에 알립니다. 숨기면 신뢰가 무너지고, 밝히면 전문가로 보입니다.",
  {x:7.45,y:5.25,w:4.9,h:1.0,fontSize:13,color:INK});
s.addNotes("미성년자 가디언 요건과 한국 측 알선 규제는 착수 전 확인 항목이다.");

/* 12 진학 */
s=S("CONTENT","Part 2 유학지원센터");
s.addText("말레이시아 & 싱가포르 진학",{placeholder:"title"});
[["영국식 국제학교","IGCSE → A-Level",TEAL],["미국식 국제학교","AP · 미국 고교",NAVY],
 ["IB 학교","IB Diploma",GOLD],["현지 사립","말레이시아 과정 + 영어",MUTED]].forEach((v,i)=>{
  const x=0.75+i*3.05;
  card(s,{x,y:1.6,w:2.8,h:1.5,fill:WHITE,line:v[2],name:`sch-${i}`});
  t(s,v[0],{x:x+0.25,y:1.85,w:2.3,h:0.6,fontSize:15,bold:true,color:v[2]});
  t(s,v[1],{x:x+0.25,y:2.5,w:2.3,h:0.4,fontSize:12.5,color:MUTED});
});
card(s,{x:0.75,y:3.35,w:11.85,h:1.6,fill:TLT,line:TEAL,lw:2,name:"branch"});
t(s,"핵심 셀링포인트 — 모나쉬 · 노팅엄 말레이시아 캠퍼스",{x:1.1,y:3.6,w:11.2,h:0.45,fontSize:20,bold:true,color:TEAL});
t(s,"영국 · 호주 본교 학위를 현지 비용으로 받는 구조를 한국 학부모 다수가 모릅니다. 자료집 한 쪽을 여기에 씁니다.",
  {x:1.1,y:4.1,w:11.2,h:0.6,fontSize:14.5,color:INK});
card(s,{x:0.75,y:5.15,w:11.85,h:1.35,fill:WHITE,line:WARN,name:"cost-warn2"});
t(s,"비용은 범위로만 말합니다",{x:1.1,y:5.35,w:11.2,h:0.4,fontSize:17,bold:true,color:WARN});
t(s,"학교 공식 fee schedule(연도 표기) · 입학처 서면 · 거주 가정 2곳 인터뷰로 확인한 뒤, 출처와 날짜를 함께 말합니다.",
  {x:1.1,y:5.78,w:11.2,h:0.5,fontSize:14,color:INK});
s.addNotes("단정하는 순간 책임이 생긴다. 이 원칙을 설명회 진행자 전원이 지켜야 한다.");

/* 13 SECTION 3 */
pres.addSection({ title:"Part 3 비즈니스지원센터" });
s=S("SECTION","Part 3 비즈니스지원센터"); s.background={ color:GOLD };
s.addText("PART 3",{placeholder:"body"}); s.addText("비즈니스지원센터",{placeholder:"title"});
t(s,"IT · 출판 · 리크루팅 · 한글 플랫폼",{x:0.9,y:4.4,w:11.5,h:0.4,fontSize:16,color:WHITE,transparency:20});

/* 14 IT */
s=S("CONTENT","Part 3 비즈니스지원센터");
s.addText("IT 비즈니스",{placeholder:"title"});
s.addTable([
  [{text:"서비스",options:{bold:true}},{text:"내용",options:{bold:true}},{text:"과금 가안",options:{bold:true}}],
  ["홈페이지","학원 소개 · 상담 신청 · 모바일","구축 RM 3,500 + 월 250"],
  ["블로그 · SNS 운영","콘텐츠 제작 · 업로드 · 리포트","월 RM 800~1,500"],
  ["유튜브","기획 · 편집 · 썸네일","편당 RM 400"],
  ["학원 관리 시스템","출결 · 수납 · 알림 · 대시보드","월 RM 300~600"]
],{x:0.75,y:1.5,w:11.85,colW:[3.0,5.4,3.45],fontSize:13.5,color:INK,border:{type:"solid",color:LINE,pt:1},
   align:"left",valign:"middle",rowH:0.42,fill:{color:WHITE},fontFace:"Malgun Gothic"});
card(s,{x:0.75,y:4.25,w:11.85,h:2.1,fill:WHITE,line:WARN,name:"ai-note"});
t(s,"AI 영어 앱은 가장 나중입니다",{x:1.1,y:4.5,w:11.2,h:0.45,fontSize:20,bold:true,color:WARN});
t(s,"개발비와 기간이 가장 크고(6~9개월) 경쟁이 가장 치열합니다. 학생이 없는 상태에서 앱을 만들면 쓸 사람이 없습니다.\n가맹 학원 3곳 + 학생 300명이 모인 뒤에 시작합니다. 먼저 할 일은 관리 시스템에 말하기 연습 기능 하나만 웹으로 붙여 보는 것입니다.\n우리의 무기는 AI 기술이 아니라 교실과 교사와 학생입니다.",
  {x:1.1,y:5.0,w:11.2,h:1.2,fontSize:14,color:INK});
s.addNotes("투자자나 파트너가 'AI 앱 언제 하냐'고 물으면 이 장으로 답한다.");

/* 15 출판 */
s=S("CONTENT","Part 3 비즈니스지원센터");
s.addText("출판 — 반복 수익이자 품질 통제 장치",{placeholder:"title"});
[["캠프 4주 완성","캠프 참가자","1권 + 단어장"],["정규 영어 레벨 1~6","초등 ~ 중등","레벨당 2권"],
 ["교사용 지도서","전 교사","교재별 1권"]].forEach((v,i)=>{
  const x=0.75+i*4.05;
  card(s,{x,y:1.6,w:3.75,h:1.6,fill:i===2?GLT:WHITE,line:i===2?GOLD:LINE,lw:i===2?2:1,name:`pub-${i}`});
  t(s,v[0],{x:x+0.3,y:1.85,w:3.2,h:0.6,fontSize:16,bold:true,color:INK});
  t(s,v[1],{x:x+0.3,y:2.45,w:3.2,h:0.3,fontSize:13,color:MUTED});
  t(s,v[2],{x:x+0.3,y:2.78,w:3.2,h:0.3,fontSize:13,bold:true,color:GOLD});
});
s.addTable([
  [{text:"단가 구조",options:{bold:true}},{text:"금액 (RM)",options:{bold:true}}],
  ["제작 원가 (인쇄 · 물류)","8"],["가맹점 공급가","15"],["권당 본부 마진","7"],
  ["학원 1곳(150명) 연 600권","4,200"]
],{x:0.75,y:3.5,w:5.9,colW:[4.2,1.7],fontSize:13.5,color:INK,border:{type:"solid",color:LINE,pt:1},
   align:"left",valign:"middle",rowH:0.4,fill:{color:WHITE},fontFace:"Malgun Gothic"});
card(s,{x:7.0,y:3.5,w:5.6,h:2.0,fill:GLT,name:"pub-note"});
t(s,"교사용 지도서를 반드시 같이",{x:7.35,y:3.75,w:5.0,h:0.4,fontSize:17,bold:true,color:GOLD});
t(s,"교재만 주면 안 씁니다. 교사가 준비 없이 들어가도 수업이 되는 1쪽 요약이 있어야 실제로 쓰입니다.",
  {x:7.35,y:4.2,w:5.0,h:1.1,fontSize:13.5,color:INK});
s.addNotes("가맹비를 안 받기로 했으므로 반복 수익은 교재에서 나온다. 동시에 품질 통제 장치다.");

/* 16 리크루팅 */
s=S("CONTENT","Part 3 비즈니스지원센터");
s.addText("리크루팅 · 교육 — 확장의 병목은 사람",{placeholder:"title"});
["모집","선발","학생비자","인턴십 3개월","커리큘럼 교육","채용 · 배치"].forEach((v,i)=>{
  const x=0.75+i*2.0;
  card(s,{x,y:1.6,w:1.82,h:1.4,fill:i===2?GLT:WHITE,line:i===2?GOLD:LINE,lw:i===2?2:1,name:`rc-${i}`});
  t(s,`0${i+1}`,{x:x+0.2,y:1.78,w:1.4,h:0.28,fontSize:11,bold:true,color:GOLD});
  t(s,v,{x:x+0.2,y:2.12,w:1.45,h:0.75,fontSize:13.5,bold:true,color:INK});
  if(i<5) s.addShape(pres.ShapeType.rightArrow,{x:x+1.86,y:2.22,w:0.12,h:0.22,fill:{color:GOLD}});
});
s.addTable([
  [{text:"대학 연계 형태",options:{bold:true}},{text:"내용",options:{bold:true}},{text:"대학 측 이점",options:{bold:true}}],
  ["현장실습 · 학점 인정","방학 중 4~8주","해외 실습 실적"],
  ["어학연수 + 인턴십","한 학기","취업률 지표"],
  ["복수 파견 협약(MOU)","연 2회 정기","국제화 지표"]
],{x:0.75,y:3.3,w:11.85,colW:[4.0,4.0,3.85],fontSize:13.5,color:INK,border:{type:"solid",color:LINE,pt:1},
   align:"left",valign:"middle",rowH:0.42,fill:{color:WHITE},fontFace:"Malgun Gothic"});
card(s,{x:0.75,y:5.3,w:11.85,h:1.15,fill:GLT,name:"mou-note"});
t(s,"대학 MOU 하나면 매 학기 사람이 옵니다 — 개별 모집은 1명씩 설득해야 합니다",
  {x:1.1,y:5.55,w:11.2,h:0.45,fontSize:17,bold:true,color:GOLD});
t(s,"접촉 대상 — 영어교육과 · 국제학부 · 사회봉사센터 · 취업지원처",{x:1.1,y:6.0,w:11.2,h:0.35,fontSize:13.5,color:INK});
s.addNotes("학생비자 상태의 인턴십이 근로에 해당하는지는 반드시 자문을 받는다.");

/* 17 한글 플랫폼 */
s=S("CONTENT","Part 3 비즈니스지원센터");
s.addText("한글 플랫폼 — 소중한글",{placeholder:"title"});
card(s,{x:0.75,y:1.5,w:11.85,h:1.15,fill:GLT,line:GOLD,lw:2,name:"kr-lead"});
t(s,"학원이 빈 시간대를 매출로 바꾸는 가장 빠른 방법",{x:1.1,y:1.72,w:11.2,h:0.45,fontSize:20,bold:true,color:GOLD});
t(s,"캠프는 1년에 두 번이지만 한글 수업은 매달 들어옵니다. 오전 · 이른 오후를 쓰므로 공간 비용이 추가되지 않습니다.",
  {x:1.1,y:2.18,w:11.2,h:0.4,fontSize:14,color:INK});
[["소중한글이란","H2K Research 개발 한글 학습 앱\n2~4세용 · 5~7세용\nAI 진단 기반 개인화 커리큘럼\n파닉스 방식 · 콘텐츠 300개 이상"],
 ["수업 모델","교실 주 2회 × 50분 (1반 6~8명)\n앱 홈러닝 주 5일 하루 10분\n월 1회 학부모 리포트\n교사는 리크루팅 파이프라인에서"],
 ["숫자 가안","학생 월 RM 200~250\n본부 몫 학생당 월 RM 50\n학원 30명 → 월 RM 6,000\n가맹 10곳 → 본부 월 RM 15,000"]
].forEach((v,i)=>{
  const x=0.75+i*4.05;
  card(s,{x,y:2.85,w:3.75,h:2.5,fill:WHITE,line:i===2?GOLD:LINE,lw:i===2?2:1,name:`kr-${i}`});
  t(s,v[0],{x:x+0.3,y:3.1,w:3.2,h:0.4,fontSize:16,bold:true,color:i===2?GOLD:INK});
  t(s,v[1],{x:x+0.3,y:3.6,w:3.2,h:1.6,fontSize:12.5,color:MUTED,lineSpacingMultiple:1.3});
});
card(s,{x:0.75,y:5.55,w:11.85,h:1.1,fill:WHITE,line:WARN,name:"kr-warn"});
t(s,"MOU 전에 확인 — 지역 독점권 · 라이선스 단가 · 오프라인 수업 결합 허용 범위",
  {x:1.1,y:5.75,w:11.2,h:0.4,fontSize:16,bold:true,color:WARN});
t(s,"우리는 재판매자가 아니라 해외 오프라인 거점입니다. 말레이시아 교실 데이터는 상대에게 해외 진출 레퍼런스가 됩니다.",
  {x:1.1,y:6.16,w:11.2,h:0.4,fontSize:13.5,color:INK});
s.addNotes("앱만 팔면 학원은 중개 수수료만 남는다. 앱 + 교실 결합이 핵심. 첫 반은 6명으로 연다.");

/* 18 우선순위 */
pres.addSection({ title:"실행" });
s=S("CONTENT","실행");
s.addText("10개를 동시에 하면 하나도 안 된다",{placeholder:"title"});
const pri=[["1","어학캠프 (한국 학원 연계)","현금이 가장 빨리 돈다",true],
 ["2","관리 시스템 1단계","학원과의 관계를 여는 열쇠",true],
 ["3","유학 설명회 (한국)","설명회 2회로 시장을 확인한다",true],
 ["4","한글 플랫폼 (소중한글)","접촉은 지금, 개설은 캠프 뒤",true],
 ["5","홍보","위의 결과물이 콘텐츠가 된다",false],
 ["6","리크루팅 (대학 MOU)","사람이 있어야 확장한다",false],
 ["7","출판 (캠프 교재)","캠프 1기 직후",false],
 ["8","유학 지원 (현지 · 진학)","설명회 수요가 확인된 뒤",false],
 ["9","IT 서비스","가맹 학원이 생긴 뒤",false],
 ["10","AI 영어 앱","학생 300명이 모인 뒤",false]];
pri.forEach((p0,i)=>{
  const col=i%2,row=Math.floor(i/2);
  const x=0.75+col*6.05,y=1.5+row*1.03;
  card(s,{x,y,w:5.75,h:0.88,fill:p0[3]?LT:WHITE,line:p0[3]?NAVY:LINE,name:`pri-${i}`});
  t(s,p0[0],{x:x+0.22,y:y+0.24,w:0.5,h:0.4,fontSize:15,bold:true,color:p0[3]?NAVY:MUTED,align:"center"});
  t(s,p0[1],{x:x+0.85,y:y+0.1,w:4.7,h:0.38,fontSize:14.5,bold:true,color:INK});
  t(s,p0[2],{x:x+0.85,y:y+0.46,w:4.7,h:0.32,fontSize:12,color:MUTED});
});
t(s,"분기당 2개만 엽니다. 나머지는 문서로만 존재해도 됩니다.",
  {x:0.75,y:6.45,w:11.85,h:0.4,fontSize:15,bold:true,color:NAVY});
s.addNotes("이 장이 기획서 전체에서 가장 중요한 장이다. 욕심이 사업을 죽인다.");

/* 19 로드맵 + 리스크 */
s=S("CONTENT","실행");
s.addText("90일 로드맵과 선결 과제",{placeholder:"title"});
[["D+1~30","어학원 합의 · 시스템 1단계 착수 · 한국 학원 3곳 접촉\n변호사 · 이민 자문 2건 · 소중한글 접촉 메일"],
 ["D+31~60","겨울캠프 모객 (11월 중순 마감) · 시스템 1단계 가동\n유학 설명회 1회"],
 ["D+61~90","캠프 1기 운영 · 콘텐츠 축적 · 대학 MOU 1곳 접촉\n교재 기획 착수"]].forEach((v,i)=>{
  const x=0.75+i*4.05;
  card(s,{x,y:1.55,w:3.75,h:2.1,fill:WHITE,line:i===0?NAVY:LINE,lw:i===0?2:1,name:`rm-${i}`});
  t(s,v[0],{x:x+0.3,y:1.78,w:3.2,h:0.4,fontSize:16,bold:true,color:NAVY});
  t(s,v[1],{x:x+0.3,y:2.25,w:3.2,h:1.25,fontSize:13,color:MUTED,lineSpacingMultiple:1.25});
});
card(s,{x:0.75,y:3.9,w:11.85,h:2.5,fill:WHITE,line:WARN,lw:2,name:"risk"});
t(s,"착수 전에 반드시 풀어야 할 두 가지",{x:1.1,y:4.1,w:11.2,h:0.45,fontSize:20,bold:true,color:WARN});
[["프랜차이즈법 (1998)","가맹비가 없어도 등록 의무 대상일 수 있습니다. MyFEX 2.0 등록 여부를 1호점 모집 전에 변호사와 확정합니다. 미등록 시 법인 벌금 최대 RM 250,000."],
 ["학생비자 인턴십","보수를 받는 수업 보조는 근로로 볼 여지가 있습니다. 인턴십을 교육과정의 일부로 설계하고 보수 지급 전 자문을 받습니다."]
].forEach((v,i)=>{
  const y=4.65+i*0.85;
  t(s,v[0],{x:1.1,y:y,w:2.9,h:0.4,fontSize:15,bold:true,color:INK});
  t(s,v[1],{x:4.2,y:y+0.02,w:8.1,h:0.75,fontSize:13,color:MUTED});
});
s.addNotes("리스크 장을 마지막에서 두 번째에 둔다. 덮고 가지 않는다는 신호.");

/* 20 마무리 */
s=S("CLOSING","실행");
s.addText("Part 1 입구 · Part 2 전환 · Part 3 복제",{placeholder:"title"});
t(s,"세 센터가 같은 토대를 씁니다 — 하나를 세우면 나머지 둘이 쉬워집니다",
  {x:0.9,y:2.75,w:11.5,h:0.5,fontSize:19,color:WHITE,transparency:10});
[["지금 여는 것","어학캠프 · 관리 시스템"],["지금 접촉할 것","소중한글 · 한국 학원 3곳"],
 ["지금 받을 자문","프랜차이즈법 · 학생비자"]].forEach((v,i)=>{
  const x=0.9+i*3.9;
  s.addShape(pres.ShapeType.roundRect,{x,y:3.8,w:3.6,h:1.35,rectRadius:0.06,
    fill:{color:WHITE},line:{color:WHITE,width:1},objectName:`end-${i}`});
  t(s,v[0],{x:x+0.3,y:4.05,w:3.0,h:0.4,fontSize:16,bold:true,color:NAVY});
  t(s,v[1],{x:x+0.3,y:4.5,w:3.0,h:0.5,fontSize:13.5,color:MUTED});
});
t(s,"통합 지원센터 사업 구조 v2.0   ·   금액은 모두 가안이며 실제 단가 확인 후 갱신합니다",
  {x:0.9,y:5.65,w:11.5,h:0.4,fontSize:13,color:WHITE,transparency:25});
s.addNotes("마지막은 '무엇을 지금 하는가' 세 가지로 닫는다.");

(async()=>{ await pres.writeFile({fileName:"통합지원센터.pptx"});
  await applyTheme("통합지원센터.pptx", THEME); console.log("written"); })();

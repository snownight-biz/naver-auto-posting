# 📌 네이버 블로그 자동 포스팅 시스템 (with ChatGPT & Puppeteer)

이 프로젝트는 **매일 1회**, **ChatGPT (OpenAI API)**를 이용해 자동으로 블로그 글을 생성하고, **Puppeteer**를 이용해 네이버 블로그에 자동으로 업로드하는 시스템입니다.

---

## 🚀 주요 기능

- **OpenAI API (GPT-4o)** 를 이용한 IT 관련 블로그 글 자동 생성
- **Puppeteer**를 통한 네이버 블로그 자동 로그인 및 포스팅
- **PM2**를 통한 Node.js 자동 스케줄 실행 관리
- 글의 **제목과 본문을 자동으로 분리**하여 처리
- **중복 콘텐츠 방지**를 위한 프롬프트 고도화 제공

---

## 📂 프로젝트 구조

naver-auto-posting/<br/>
├── .env # 환경변수 파일<br/>
├── package.json # 의존성 관리<br/>
├── index.js # 메인 실행 파일<br/>
├── services/<br/>
│ ├── generatePost.js # 블로그 글 생성 서비스 (OpenAI API)<br/>
│ └── uploadToNaver.js # 네이버 블로그 업로드 서비스 (Puppeteer)<br/>
└── ecosystem.config.js # PM2 실행 스케줄 설정 파일<br/>


---

## ⚙️ 설치 방법

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone YOUR_REPOSITORY_URL
cd naver-auto-posting
npm install
```

### 2. `.env` 환경변수 설정 (필수)

프로젝트 루트에 `.env` 파일을 만들고 아래 내용을 입력하세요.

```env
OPENAI_API_KEY=당신의_OpenAI_API키
NAVER_ID=당신의_네이버_아이디
NAVER_PW=당신의_네이버_비밀번호
```

🚨 환경변수 설명

OPENAI_API_KEY: OpenAI API 키 발급받기

NAVER_ID: 네이버 블로그 로그인 ID

NAVER_PW: 네이버 블로그 로그인 비밀번호

### 🔐 .env는 반드시 .gitignore에 추가하여 공개하지 마세요.

## 🎈 자동 실행 설정 (PM2)
### 매일 오전 9시 자동 실행 예시입니다.

```js
module.exports = {
  apps: [{
    name: 'naver-blog-bot',
    script: 'index.js',
    cron_restart: '0 9 * * *', // 매일 오전 9시
    autorestart: false,
    watch: false,
  }]
};

```
### PM2 실행 및 자동 시작 등록
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## ⚠️ 필수 환경변수 설명

OPENAI_API_KEY: OpenAI API Key 발급받기

NAVER_ID: 네이버 블로그 로그인 아이디

NAVER_PW: 네이버 블로그 로그인 비밀번호

🔐 .env 파일은 민감 정보가 포함되어 있으니 절대 GitHub에 공개하지 마세요.
GitHub에 올릴 경우 반드시 .gitignore에 포함하세요.

## 📝 글 생성 프롬프트 상세정보
### 주제: 최신 IT 트렌드, 기술 및 도구 소개

### 대상: 디지털 노마드, 초보 개발자

### 말투: 친근한 구어체 (친한 동생에게 말하듯)

### 구성: 서론/본론/결론 (단어 직접 사용하지 않고 줄바꿈으로 구분)

### 기타: 중복 콘텐츠 방지 설정

## ⚠️ 주의사항
### 네이버 자동 로그인은 네이버 약관 위반 가능성이 있습니다. 책임은 사용자에게 있습니다.
### 민감 정보 관리에 주의하세요 (.env 파일을 외부에 공개하지 마세요).

# 💬 문의 및 기여
snownight.biz@gmail.com

snownight_biz@naver.com
### 이슈나 PR은 언제든지 환영합니다.

# 🚀 Happy Auto Posting!

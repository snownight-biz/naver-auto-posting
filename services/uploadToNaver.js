require('dotenv').config();
const puppeteer = require('puppeteer');

/* ───────── 로그인 공통 함수 ───────── */
async function loginNaver(page, id, pw) {
  await page.goto('https://nid.naver.com/nidlogin.login');
  await page.waitForSelector('#id');
  await page.type('#id', id, { delay: 50 });
  await page.type('#pw', pw, { delay: 50 });
  await page.click('.btn_login');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  if (page.url().includes('nid.naver.com')) throw new Error('로그인 실패');
}

/* ───────── 메인 업로드 함수 ───────── */
async function uploadToNaver(title, content) {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();

  /* 1. 로그인 */
  await loginNaver(page, process.env.NAVER_ID, process.env.NAVER_PW);

  /* 2. 글쓰기 페이지 이동 */
  const postUrl = `https://blog.naver.com/${process.env.NAVER_ID}/postwrite`;
  await page.goto(postUrl, { waitUntil: 'networkidle2' });

  /* 3. 임시글 복원 팝업 → ‘취소’ */
  try {
    await page.waitForSelector('.se-popup-container.__se-pop-layer', { timeout: 3000 });
    const cancelBtn = await page.$('button.se-popup-button-cancel');
    if (cancelBtn) {
      await cancelBtn.click();
      console.log('🟡 임시글 복원 팝업 → 취소');
    }
  } catch (_) {
    console.log('✅ 팝업 없음');
  }
  // 3-1. 팝업 처리 후 5초 대기
  await new Promise(resolve => setTimeout(resolve, 2000));

  /* 4. ───── 제목 입력 ───── */
  // 4-1) 제목 문단(첫 se-text-paragraph, se-documentTitle 내부) 찾기
  const paragraphs = await page.$$('.se-text-paragraph');

  if (paragraphs.length < 2) {
    throw new Error('에디터 블록이 충분하지 않습니다.');
  }

  /* 4. ───── 제목 입력 (타이핑) ───── */
// 4-1) se-documentTitle 내부 첫 번째 se-text-paragraph 가져오기
  await page.waitForSelector('.se-documentTitle .se-text-paragraph');
  const titleParagraph = await page.$('.se-documentTitle .se-text-paragraph');

// 4-2) 클릭 후 기존 내용 전체 선택 → 삭제
  await titleParagraph.click();
  await page.keyboard.down('Control'); await page.keyboard.press('A'); await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');

// 4-3) 타이틀 문자열을 직접 타이핑
  await page.type('.se-documentTitle .se-text-paragraph', title, { delay: 30 });


  /* 5. ───── 본문 입력 ───── */
  // 5-1) Enter로 새 본문 블록 생성
  await page.keyboard.press('Enter');
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 5-2) 본문 붙여넣기
  await page.evaluate(txt => navigator.clipboard.writeText(txt), content);
  await page.keyboard.down('Control'); await page.keyboard.press('V'); await page.keyboard.up('Control');

  /* 6. ───── 1차 ‘발행’ 클릭 ───── */
  await page.waitForFunction(() =>
      Array.from(document.querySelectorAll("button[class^='publish_btn__']"))
        .some(btn => btn.textContent.trim().includes('발행')),
    { timeout: 5000 }
  );
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button[class^='publish_btn__']"))
      .find(el => el.textContent.trim().includes('발행'));
    if (btn) btn.click();
  });
  console.log('✅ 1차 발행 버튼 클릭');

  /* 7. ───── 최종 확인 ‘발행’ 클릭 ───── */
  await page.waitForFunction(() =>
      Array.from(document.querySelectorAll("button[class^='confirm_btn__']"))
        .some(btn => btn.textContent.trim().includes('발행')),
    { timeout: 5000 }
  );
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button[class^='confirm_btn__']"))
      .find(el => el.textContent.trim().includes('발행'));
    if (btn) btn.click();
  });
  console.log('✅ 최종 발행 완료');

  // await browser.close();
}

module.exports = { uploadToNaver };

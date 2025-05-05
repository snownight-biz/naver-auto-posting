const { generatePost } = require('./services/generatePost');
const { uploadToNaver } = require('./services/uploadToNaver');

(async () => {
  try {
    const { title, content } = await generatePost();
    console.log('✅ 생성된 제목:', title);
    console.log('✅ 생성된 본문:', content);

    await uploadToNaver(title, content);
  } catch (err) {
    console.error('에러:', err);
  }
})();

require('dotenv').config();
const axios = require('axios');

async function generatePost() {
  try {
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: '당신은 IT 분야의 블로그 작가입니다. 디지털 노마드 및 초보 개발자들에게 쉽고 친근한 말투로 IT 뉴스를 전달합니다.'
          },
          {
            role: 'user',
            content: `
오늘의 블로그 글을 아래 조건에 맞게 작성해줘.

- 주제: 최근 이슈가 되고 있는 IT 관련 뉴스 (개발 트렌드, 새로운 기술, 유용한 도구 등)
- 대상 독자: 디지털 노마드 또는 초보 개발자 또는 IT에 관심이 많은 일반인
- 글의 길이: 1000자에서 2000자 내외
- 글의 형식:
  - 처음에는 흥미로운 이야기나 주제에 대한 소개로 자연스럽게 시작하고,
  - 중간에는 핵심 주제에 관한 내용과 정보를 소제목으로 나누어 자세히 설명하고,
  - 마지막 부분에는 전체 내용을 깔끔하게 정리하며 독자에게 간단한 조언이나 당부를 넣어서 마무리할 것
  - 각 부분은 줄바꿈으로 확실히 구분해줘 (명확하게 알아볼 수 있도록)
- 말투와 스타일:
  - 친한 동생에게 이야기하듯 친근한 구어체로 자연스럽게 작성
  - 최대한 AI 느낌이 들지 않도록, 사람이 쓴 것처럼 자연스럽게 작성할 것
  - 잘 모르는 부분이 있으면 억지로 아는 척하지 말고 솔직하게 ‘이 부분은 나도 정확히 모르겠다’ 라고 표현할 것
  
**중요:** 반드시 글의 맨 첫 줄에 [제목]을 넣어줘.
형식은 다음과 같이:
제목: (여기에 제목 작성)
(본문 내용...)

**추가 지침:** 매일 포스팅되는 글이므로 이전에 작성했던 내용은 절대로 반복하지 말고 항상 다른 주제를 선택해서 작성해줘. 이미 썼던 내용이나 주제는 다시 사용하지 않도록 주의해줘.
`
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const fullContent = res.data.choices[0].message.content;

    // 제목과 본문을 분리해서 반환
    const titleMatch = fullContent.match(/제목:\s*(.*)/);
    const title = titleMatch ? titleMatch[1].trim() : '제목 없음';
    const content = fullContent.replace(/제목:.*\n?/, '').trim();

    return { title, content };
  } catch (e) {
    console.log(e.response.data);
    return { title: '오류', content: '오류로 인해 글 작성 실패' };
  }
}

module.exports = { generatePost };

module.exports = {
  apps: [{
    name: 'naver-blog-bot',
    script: 'index.js',
    cron_restart: '0 9 * * *', // 매일 오전 9시
    autorestart: false,
    watch: false,
  }]
};

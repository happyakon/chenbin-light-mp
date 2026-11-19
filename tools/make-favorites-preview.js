/**
 * 生成收藏页滑动范围对比图
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots');
fs.mkdirSync(OUT, { recursive: true });

function phone(items, caption, isGood) {
  const dots = items
    .map(
      (it, i) => `
      <div class="slide ${i === 0 ? 'is-active' : ''}">
        <div class="slide-inner" style="background:${it.bg}">
          <span class="slide-label">${it.label}</span>
        </div>
      </div>`
    )
    .join('');

  return `
  <div class="wrap">
    <div class="phone">
      <div class="bar">
        <span class="bar-title">${caption.title}</span>
        <span class="bar-count">1 / ${items.length}</span>
      </div>
      <div class="slides">${dots}</div>
      <div class="hint ${isGood ? 'good' : 'bad'}">${caption.hint}</div>
    </div>
    <div class="cap">${caption.text}</div>
  </div>`;
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #141414;
    padding: 36px;
    font-family: -apple-system, "PingFang SC", sans-serif;
    display: flex;
    gap: 48px;
    justify-content: center;
    align-items: flex-start;
  }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; }

  .phone {
    width: 360px;
    height: 640px;
    background: #0d0d0d;
    border-radius: 32px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 0 0 2px rgba(255,255,255,.08), 0 16px 40px rgba(0,0,0,.7);
    display: flex;
    flex-direction: column;
  }

  .bar {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
    border-bottom: 1px solid rgba(255,255,255,.06);
    flex: 0 0 auto;
  }
  .bar-title { font-size: 13px; color: #f0efec; letter-spacing: .05em; }
  .bar-count { font-size: 12px; color: #8a8884; }

  .slides {
    flex: 1;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
  }

  .slide {
    flex: 1;
    border-radius: 8px;
    overflow: hidden;
    opacity: .35;
    position: relative;
  }
  .slide.is-active { opacity: 1; }

  .slide-inner {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .slide-label {
    font-size: 12px;
    color: rgba(255,255,255,.9);
    background: rgba(0,0,0,.5);
    padding: 4px 10px;
    border-radius: 12px;
  }

  .hint {
    padding: 12px 18px;
    font-size: 11.5px;
    line-height: 1.7;
    flex: 0 0 auto;
  }
  .hint.good { color: #7ec99a; background: rgba(126,201,154,.08); }
  .hint.bad { color: #d98b8b; background: rgba(217,139,139,.08); }

  .cap {
    font-size: 12px;
    color: #888;
    text-align: center;
    max-width: 360px;
    line-height: 1.7;
  }
</style>
</head>
<body>

${phone(
  [
    { label: '收藏照片 A', bg: 'linear-gradient(160deg,#3a4a5a,#1a2430)' },
    { label: '收藏照片 B', bg: 'linear-gradient(160deg,#5a4a3a,#302418)' },
  ],
  {
    title: '我的收藏',
    hint: '左右滑动：只有这 2 张，滑到头就停',
    text: '改动后：收藏内左右滑动',
  },
  true
)}

${phone(
  [
    { label: '收藏照片 A', bg: 'linear-gradient(160deg,#3a4a5a,#1a2430)' },
    { label: '相册里的其他照片 1', bg: 'linear-gradient(160deg,#2a2a2a,#151515)' },
    { label: '相册里的其他照片 2', bg: 'linear-gradient(160deg,#2a2a2a,#151515)' },
    { label: '相册里的其他照片 3', bg: 'linear-gradient(160deg,#2a2a2a,#151515)' },
    { label: '…共 28 张', bg: 'linear-gradient(160deg,#2a2a2a,#151515)' },
  ],
  {
    title: '人物光影',
    hint: '左右滑动：跑进整个相册的 28 张',
    text: '改动前：滑出收藏范围',
  },
  false
)}

</body>
</html>`;

const file = path.join(OUT, 'favorites-slide-preview.html');
fs.writeFileSync(file, html, 'utf8');
console.log('生成:', file);

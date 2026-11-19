/**
 * 加密相册卡片 前后对比
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots');
fs.mkdirSync(OUT, { recursive: true });

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #141414; padding: 40px;
    font-family: -apple-system, "PingFang SC", sans-serif;
    display: flex; gap: 56px; justify-content: center;
  }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; }

  /* 模拟 2 列网格里的单个卡片宽度（375 屏，两列各约 165px） */
  .card { width: 172px; }

  .cover-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 4;
    border-radius: 4px;
    overflow: hidden;
    background: #141414;
    box-shadow: 0 3px 14px rgba(0,0,0,.5);
  }

  /* ---------- 旧版 ---------- */
  .cover-empty-old {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    background: #141414;
  }
  .lock-old { font-size: 28px; opacity: .5; }

  /* ---------- 新版 ---------- */
  .cover-empty {
    position: relative;
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: linear-gradient(158deg, #1c1c22 0%, #141418 48%, #0e0e11 100%);
    overflow: hidden;
  }
  .empty-glow {
    position: absolute; left: 50%; top: 50%;
    width: 140px; height: 140px;
    margin-left: -70px; margin-top: -70px;
    border-radius: 50%;
    background: radial-gradient(circle,
      rgba(201,168,106,.15) 0%,
      rgba(201,168,106,.06) 34%,
      rgba(201,168,106,.016) 56%,
      rgba(201,168,106,0) 74%);
  }
  .empty-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(to right, rgba(240,239,236,.025) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(240,239,236,.03) 1px, transparent 1px);
    background-size: 28px 28px;
  }
  .lock-badge {
    position: relative;
    width: 48px; height: 48px;
    display: flex; align-items: center; justify-content: center;
  }
  .lock-ring {
    position: absolute;
    width: 48px; height: 48px;
    border-radius: 50%;
    border: 1px solid rgba(201,168,106,.3);
    background: rgba(201,168,106,.03);
  }
  .lock-icon {
    position: relative;
    font-size: 22px; line-height: 1;
    text-shadow: 0 1.5px 6px rgba(201,168,106,.4);
  }
  .empty-caption {
    position: relative;
    margin-top: 9px;
    font-size: 10px;
    letter-spacing: .22em;
    text-indent: .22em;
    color: rgba(201,168,106,.5);
  }

  /* 卡片底部文字（标题 + 张数） */
  .badge-circle {
    position: absolute; top: 8px; right: 8px;
    width: 24px; height: 24px; border-radius: 50%;
    background: rgba(0,0,0,.6);
    border: 1px solid rgba(201,168,106,.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px;
    z-index: 3;
  }
  .cover-text {
    position: absolute; left: 0; right: 0; bottom: 0;
    padding: 14px 12px 12px;
    z-index: 2;
  }
  .cn {
    font-family: "Songti SC", "SimSun", serif;
    font-size: 15px; letter-spacing: .08em; color: #f0efec;
  }
  .en {
    margin-top: 5px;
    font-size: 8px; letter-spacing: .14em;
    color: rgba(240,239,236,.5);
    text-transform: uppercase;
  }
  .shade {
    position: absolute; left: 0; right: 0; bottom: 0;
    height: 55%;
    background: linear-gradient(to top, rgba(0,0,0,.85), transparent);
    z-index: 1;
  }
  .count {
    margin-top: 6px; font-size: 11px;
    letter-spacing: .06em; color: #5a5956;
  }

  .cap { font-size: 12px; text-align: center; }
  .cap.bad { color: #d98b8b; }
  .cap.good { color: #7ec99a; }
`;

function card(variant, title, en, count) {
  const isNew = variant === 'new';

  return `
  <div class="card">
    <div class="cover-wrap">
      ${isNew ? `
      <div class="cover-empty">
        <div class="empty-glow"></div>
        <div class="empty-grid"></div>
        <div class="lock-badge">
          <div class="lock-ring"></div>
          <div class="lock-icon">🔒</div>
        </div>
        <div class="empty-caption">加密相册</div>
      </div>
      ` : `
      <div class="cover-empty-old">
        <div class="lock-old">🔒</div>
      </div>
      `}

      <div class="shade"></div>
      <div class="badge-circle">🔒</div>
      <div class="cover-text">
        <div class="cn">${title}</div>
        <div class="en">${en}</div>
      </div>
    </div>
    <div class="count">${count} 张</div>
  </div>`;
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8" /><style>${css}</style></head>
<body>
<div class="wrap">
  ${card('old', '人物光影', 'Portraits', 28)}
  <div class="cap bad">改动前：纯黑 + 小 emoji</div>
</div>
<div class="wrap">
  ${card('new', '人物光影', 'Portraits', 28)}
  <div class="cap good">改动后：渐变底 + 光晕 + 网格 + 锁环 + 文案</div>
</div>
</body>
</html>`;

const file = path.join(OUT, 'locked-card-preview.html');
fs.writeFileSync(file, html, 'utf8');
console.log('生成:', file);

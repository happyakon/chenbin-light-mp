/**
 * 生成圆形徽章用的细小锁图标
 *
 * 卡片右上角那个 48rpx 的圆里放不下 1.6px 线宽的锁，
 * 需要单独一个更细、更紧凑的版本。
 */
const fs = require('fs');
const path = require('path');

/* 紧凑版：viewBox 更小，线宽相对更细，适合小尺寸显示 */
const BADGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 28" fill="none" stroke="#c9a86a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="12" width="18" height="13" rx="2.5"/>
  <path d="M7.5 12V7.5a4.5 4.5 0 0 1 9 0V12"/>
  <circle cx="12" cy="18" r="1.4"/>
  <path d="M12 19.4v2.2"/>
</svg>`;

const b64 = Buffer.from(BADGE_SVG, 'utf8').toString('base64');
const dataUri = 'data:image/svg+xml;base64,' + b64;

console.log('\n=== 徽章锁 base64 ===\n');
console.log(dataUri);
console.log('');
console.log('长度:', dataUri.length);

/* 生成预览：放大看细节 + 实际尺寸看效果 */
const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots');
fs.mkdirSync(OUT, { recursive: true });

const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #141414; padding: 40px;
    font-family: -apple-system, "PingFang SC", sans-serif;
    display: flex; gap: 48px; justify-content: center; align-items: flex-start;
  }
  .col { display: flex; flex-direction: column; align-items: center; gap: 16px; }

  /* 模拟卡片上的实际大小 */
  .card {
    width: 172px; aspect-ratio: 3/4;
    border-radius: 4px; position: relative;
    background: linear-gradient(158deg, #2a2a30, #16161a);
    box-shadow: 0 3px 14px rgba(0,0,0,.5);
    overflow: hidden;
  }

  /* 徽章：实际尺寸 24px（48rpx） */
  .badge {
    position: absolute; top: 8px; right: 8px;
    width: 24px; height: 24px; border-radius: 50%;
    background: rgba(0,0,0,.6);
    border: 1px solid rgba(201,168,106,.25);
    display: flex; align-items: center; justify-content: center;
  }
  .badge .emoji { font-size: 11px; line-height: 1; }
  .badge img { width: 12px; height: 14px; display: block; }

  /* 放大版，看线条细节 */
  .zoom {
    width: 120px; height: 120px; border-radius: 50%;
    background: rgba(0,0,0,.6);
    border: 1px solid rgba(201,168,106,.25);
    display: flex; align-items: center; justify-content: center;
  }
  .zoom img { width: 60px; height: 70px; display: block; }

  .cap { font-size: 12px; color: #888; text-align: center; line-height: 1.7; }
  .cap.bad { color: #d98b8b; }
  .cap.good { color: #7ec99a; }
</style></head>
<body>

<div class="col">
  <div class="card">
    <div class="badge"><span class="emoji">🔒</span></div>
  </div>
  <div class="cap bad">改动前：彩色 emoji<br>（实际大小）</div>
</div>

<div class="col">
  <div class="card">
    <div class="badge"><img src="${dataUri}" /></div>
  </div>
  <div class="cap good">改动后：金色线框<br>（实际大小）</div>
</div>

<div class="col">
  <div class="zoom"><img src="${dataUri}" /></div>
  <div class="cap">放大 5 倍看线条</div>
</div>

</body></html>`;

fs.writeFileSync(path.join(OUT, 'badge-lock-preview.html'), html, 'utf8');
console.log('');
console.log('预览:', path.join(OUT, 'badge-lock-preview.html'));

/**
 * 解锁页质感 —— 局部放大对比（能看清网格和光晕）
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots');
fs.mkdirSync(OUT, { recursive: true });

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #141414; padding: 32px;
    font-family: -apple-system, "PingFang SC", sans-serif;
  }
  .row { display: flex; gap: 28px; justify-content: center; margin-bottom: 28px; }
  .cell { display: flex; flex-direction: column; align-items: center; gap: 10px; }

  .crop {
    width: 420px; height: 300px;
    border-radius: 14px; overflow: hidden;
    position: relative;
    box-shadow: 0 0 0 1px rgba(255,255,255,.08);
  }
  .layer { position: absolute; inset: 0; }

  .base { background: linear-gradient(168deg, #14141a 0%, #0d0d0f 42%, #0a0a0b 100%); }
  .glow {
    background: radial-gradient(110% 90% at 50% 40%,
      rgba(201,168,106,.14) 0%,
      rgba(201,168,106,.06) 32%,
      rgba(201,168,106,.018) 56%,
      rgba(201,168,106,0) 76%);
  }
  .grid {
    background-image:
      linear-gradient(to right, rgba(240,239,236,.035) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(240,239,236,.035) 1px, transparent 1px);
    background-size: 42px 42px;
  }

  /* 锁徽章放大版 */
  .badge-wrap {
    position: absolute; left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: 200px; height: 200px;
    display: flex; align-items: center; justify-content: center;
  }
  .glow-outer {
    position: absolute; width: 190px; height: 190px;
    border-radius: 50%;
    background: radial-gradient(circle,
      rgba(201,168,106,.18) 0%,
      rgba(201,168,106,.075) 36%,
      rgba(201,168,106,.02) 58%,
      rgba(201,168,106,0) 74%);
  }
  .glow-inner {
    position: absolute; width: 110px; height: 110px;
    border-radius: 50%;
    background: radial-gradient(circle,
      rgba(201,168,106,.11) 0%,
      rgba(201,168,106,.032) 55%,
      rgba(201,168,106,0) 75%);
  }
  .ring {
    position: absolute; width: 100px; height: 100px;
    border-radius: 50%;
    border: 1px solid rgba(201,168,106,.28);
    background: rgba(201,168,106,.025);
  }
  .lock {
    position: relative; font-size: 42px; line-height: 1;
    text-shadow: 0 4px 14px rgba(201,168,106,.45), 0 1px 4px rgba(0,0,0,.5);
  }

  .label { font-size: 12px; color: #888; text-align: center; }
  .label.good { color: #7ec99a; }
  .label.bad { color: #d98b8b; }

  .title { font-size: 15px; color: #ccc; margin-bottom: 18px; text-align: center; letter-spacing: .1em; }
  .sub { font-size: 12px; color: #666; margin-top: 6px; text-align: center; line-height: 1.7; }
`;

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8" /><style>${css}</style></head>
<body>

<div class="title">局部放大 · 看清纹理层次</div>

<div class="row">
  <!-- 纯色 -->
  <div class="cell">
    <div class="crop">
      <div class="layer base"></div>
      <div class="badge-wrap">
        <div class="lock">🔒</div>
      </div>
    </div>
    <div class="label bad">改动前：纯色 + 单独 emoji</div>
  </div>

  <!-- 完整质感 -->
  <div class="cell">
    <div class="crop">
      <div class="layer base"></div>
      <div class="layer glow"></div>
      <div class="layer grid"></div>
      <div class="badge-wrap">
        <div class="glow-outer"></div>
        <div class="glow-inner"></div>
        <div class="ring"></div>
        <div class="lock">🔒</div>
      </div>
    </div>
    <div class="label good">改动后：光晕 + 网格 + 三层徽章</div>
  </div>
</div>

<div class="sub">
  网格间距 84rpx（约 42px），透明度 0.035<br>
  在深色背景上能看出织物感，但不会抢主体
</div>

</body>
</html>`;

const file = path.join(OUT, 'unlock-texture-zoom.html');
fs.writeFileSync(file, html, 'utf8');
console.log('生成:', file);

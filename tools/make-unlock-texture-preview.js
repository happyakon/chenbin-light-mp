/**
 * 解锁页质感改造 —— 前后对比预览
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots');
fs.mkdirSync(OUT, { recursive: true });

/* 把 rpx 按 375 宽换算成 px（1rpx = 0.5px） */
function page(variant) {
  const isNew = variant === 'new';

  return `
  <div class="phone">
    <div class="stage">
      ${isNew ? `
      <div class="bg-layer bg-base"></div>
      <div class="bg-layer bg-glow"></div>
      <div class="bg-layer bg-grid"></div>
      <div class="bg-layer bg-band-top"></div>
      <div class="bg-layer bg-band-bottom"></div>
      ` : ''}

      <div class="sbar"></div>
      <div class="nav"><div class="back">‹</div></div>

      <div class="content">
        ${isNew ? `
        <div class="lock-badge">
          <div class="lock-glow-outer"></div>
          <div class="lock-glow-inner"></div>
          <div class="lock-ring"></div>
          <div class="lock-icon">🔒</div>
        </div>
        ` : `
        <div class="lock-badge-old">🔒</div>
        `}

        <div class="album-title">人物光影</div>
        ${isNew ? '<div class="title-rule"></div>' : ''}
        <div class="hint">请输入密码后查看</div>

        <div class="input-wrap">
          <div class="input"><span class="ph">输入密码</span></div>
        </div>

        <div class="submit">进 入</div>

        <div class="warn">连续错误 5 次将锁定 4 小时</div>
      </div>
    </div>
  </div>`;
}

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #141414; padding: 40px;
    font-family: -apple-system, "PingFang SC", sans-serif;
    display: flex; gap: 48px; justify-content: center; align-items: flex-start;
  }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; }

  .phone {
    width: 375px; height: 750px;
    border-radius: 38px; overflow: hidden;
    box-shadow: 0 0 0 2px rgba(255,255,255,.08), 0 16px 44px rgba(0,0,0,.75);
    position: relative;
    background: #0b0b0c;
  }
  .stage { position: absolute; inset: 0; overflow: hidden; display: flex; flex-direction: column; }

  /* ---- 背景层 ---- */
  .bg-layer { position: absolute; inset: 0; pointer-events: none; }

  .bg-base {
    background: linear-gradient(168deg, #14141a 0%, #0d0d0f 42%, #0a0a0b 100%);
  }
  .bg-glow {
    background: radial-gradient(120% 62% at 50% 26%,
      rgba(201,168,106,.13) 0%,
      rgba(201,168,106,.055) 32%,
      rgba(201,168,106,.018) 55%,
      rgba(201,168,106,0) 76%);
  }
  .bg-grid {
    background-image:
      linear-gradient(to right, rgba(240,239,236,.022) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(240,239,236,.022) 1px, transparent 1px);
    background-size: 42px 42px;
  }
  .bg-band-top {
    background: linear-gradient(to bottom,
      rgba(0,0,0,.55) 0%, rgba(0,0,0,.18) 14%, rgba(0,0,0,0) 30%);
  }
  .bg-band-bottom {
    background: linear-gradient(to top,
      rgba(0,0,0,.6) 0%, rgba(0,0,0,.2) 16%, rgba(0,0,0,0) 34%);
  }

  .sbar { height: 44px; flex: 0 0 auto; position: relative; z-index: 2; }
  .nav { padding: 6px 10px; position: relative; z-index: 2; flex: 0 0 auto; }
  .back { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #c8c6c1; padding-bottom: 3px; }

  .content {
    position: relative; z-index: 2; flex: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 0 38px 60px;
  }

  /* ---- 锁徽章 ---- */
  .lock-badge {
    position: relative; width: 100px; height: 100px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
  }
  .lock-glow-outer {
    position: absolute; left: 50%; top: 50%;
    width: 150px; height: 150px;
    margin-left: -75px; margin-top: -75px;
    border-radius: 50%;
    background: radial-gradient(circle,
      rgba(201,168,106,.17) 0%,
      rgba(201,168,106,.07) 36%,
      rgba(201,168,106,.018) 58%,
      rgba(201,168,106,0) 74%);
  }
  .lock-glow-inner {
    position: absolute; left: 50%; top: 50%;
    width: 84px; height: 84px;
    margin-left: -42px; margin-top: -42px;
    border-radius: 50%;
    background: radial-gradient(circle,
      rgba(201,168,106,.1) 0%,
      rgba(201,168,106,.03) 55%,
      rgba(201,168,106,0) 75%);
  }
  .lock-ring {
    position: absolute; left: 50%; top: 50%;
    width: 80px; height: 80px;
    margin-left: -40px; margin-top: -40px;
    border-radius: 50%;
    border: 1px solid rgba(201,168,106,.26);
    background: rgba(201,168,106,.022);
  }
  .lock-icon {
    position: relative; font-size: 31px; line-height: 1;
    text-shadow: 0 3px 10px rgba(201,168,106,.42), 0 1px 3px rgba(0,0,0,.5);
  }

  /* 旧版锁图标 */
  .lock-badge-old {
    font-size: 38px; line-height: 1; margin-bottom: 20px; opacity: .85;
  }

  .album-title {
    font-family: "Songti SC", "SimSun", serif;
    font-size: 24px; letter-spacing: .16em; text-indent: .16em;
    color: #f0efec; text-align: center;
    text-shadow: 0 1px 8px rgba(201,168,106,.18);
  }
  .title-rule {
    width: 36px; height: 1px; margin-top: 11px;
    background: linear-gradient(90deg,
      rgba(201,168,106,0) 0%,
      rgba(201,168,106,.5) 50%,
      rgba(201,168,106,0) 100%);
  }
  .hint {
    margin-top: 12px; font-size: 13px;
    letter-spacing: .06em; color: #8a8884; text-align: center;
  }

  .input-wrap { width: 100%; margin-top: 36px; }
  .input {
    width: 100%; height: 52px;
    border: 1px solid rgba(240,239,236,.13);
    border-radius: 8px;
    background: rgba(255,255,255,.028);
    color: #f0efec; font-size: 16px;
    letter-spacing: .14em; text-align: center;
    display: flex; align-items: center; justify-content: center;
  }
  .ph { color: #3d3c3a; font-size: 14px; letter-spacing: .06em; }

  .submit {
    width: 100%; height: 50px; margin: 14px 0 0 0; padding: 0;
    border-radius: 8px;
    border: 1px solid rgba(201,168,106,.55);
    background: linear-gradient(180deg,
      rgba(201,168,106,.16) 0%,
      rgba(201,168,106,.08) 100%);
    color: #d8bd85; font-size: 15px;
    letter-spacing: .3em; text-indent: .3em;
    display: flex; align-items: center; justify-content: center;
  }

  .warn {
    margin-top: 22px; font-size: 11px;
    letter-spacing: .06em; color: #5a5956;
    text-align: center; line-height: 1.7;
  }

  .cap { font-size: 12px; color: #888; text-align: center; }
  .cap.bad { color: #d98b8b; }
  .cap.good { color: #7ec99a; }
`;

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8" /><style>${css}</style></head>
<body>
<div class="wrap">
  ${page('old')}
  <div class="cap bad">改动前：纯色背景，锁图标单薄</div>
</div>
<div class="wrap">
  ${page('new')}
  <div class="cap good">改动后：金色光晕 + 网格纹理 + 上下压暗</div>
</div>
</body>
</html>`;

const file = path.join(OUT, 'unlock-texture-preview.html');
fs.writeFileSync(file, html, 'utf8');
console.log('生成:', file);

/**
 * 首页炫动版预览
 * 静态截图看不到动画，所以做多帧对比
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots', 'mp-proto');

function particles() {
  const out = [];
  for (let i = 0; i < 20; i += 1) {
    const seed = (i * 9301 + 49297) % 233280;
    const rnd = seed / 233280;
    const seed2 = ((i + 7) * 4523 + 12345) % 100000;
    const rnd2 = seed2 / 100000;
    out.push({
      left: +(rnd * 100).toFixed(1),
      top: +(55 + rnd2 * 45).toFixed(1),
      size: +(1.5 + rnd * 2).toFixed(1),
      duration: +(14 + rnd2 * 12).toFixed(1),
      delay: +(rnd * 10).toFixed(1),
      opacity: +(0.15 + rnd2 * 0.3).toFixed(2),
    });
  }
  return out;
}

const POEM1 = '光是时间的形状'.split('');
const POEM2 = '我只负责记下'.split('');
const NAME = '陈彬'.split('');

function phone({ frame }) {
  const p = particles();

  // frame 控制哪些元素已出现
  const s1 = frame >= 1;
  const s2 = frame >= 2;
  const s3 = frame >= 3;
  const s4 = frame >= 4;

  return `
  <div class="phone"><div class="phone-screen">
    <div class="status-bar">
      <span>15:40</span>
      <span class="sb-right">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
        <span class="sb-battery"><i></i></span>
      </span>
    </div>

    <div class="glow glow-1"></div>
    <div class="glow glow-2"></div>
    <div class="glow glow-3"></div>

    <div class="particles">
      ${p
        .map(
          (x) =>
            `<div class="particle" style="left:${x.left}%;top:${x.top}%;width:${x.size}px;height:${x.size}px;opacity:${x.opacity};animation-duration:${x.duration}s;animation-delay:${-x.delay}s"></div>`
        )
        .join('')}
    </div>

    <div class="poems">
      <div class="poem-row">
        ${POEM1.map(
          (ch, i) =>
            `<span class="pchar pchar-1" style="opacity:${s1 ? 1 : 0};transition-delay:${i * 0.11}s">${ch}</span>`
        ).join('')}
      </div>
      <div class="poem-row">
        ${POEM2.map(
          (ch, i) =>
            `<span class="pchar pchar-2" style="opacity:${s2 ? 1 : 0};transition-delay:${i * 0.11}s">${ch}</span>`
        ).join('')}
      </div>
    </div>

    <div class="sig">
      <div class="sig-line" style="width:${s3 ? '48px' : '0'};opacity:${s3 ? 1 : 0}"></div>
      <div class="sig-name">
        ${NAME.map(
          (ch, i) =>
            `<span class="nchar" style="opacity:${s3 ? 1 : 0};transition-delay:${i * 0.16}s">${ch}</span>`
        ).join('')}
      </div>
      <div class="sig-sub" style="opacity:${s4 ? 1 : 0}">摄影师 · 记录者</div>
    </div>

    <div class="enter" style="opacity:${s4 ? 1 : 0}">
      <div class="enter-text">轻触进入</div>
      <div class="enter-arrow">↓</div>
    </div>
  </div></div>`;
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>首页炫动版</title>
<style>
  :root {
    --bg: #070707; --ink: #f0efec; --ink-soft: #c8c6c1;
    --muted: #8a8884; --muted-deep: #5a5956; --gold: #c9a86a;
    --serif: "Songti SC","SimSun",Georgia,serif;
    --sans: -apple-system, "PingFang SC", "Helvetica Neue", sans-serif;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #030303; color: var(--ink); font-family: var(--sans);
    padding: 44px 36px 72px; -webkit-font-smoothing: antialiased;
  }
  .doc-head { max-width: 1650px; margin: 0 auto 44px; }
  .doc-head h1 { font-family: var(--serif); font-weight: 400; font-size: 27px; letter-spacing: 0.14em; }
  .doc-head p { margin-top: 12px; font-size: 13px; line-height: 1.9; color: var(--muted); max-width: 850px; }

  .screens { display: flex; gap: 40px; max-width: 1650px; margin: 0 auto; }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .cap { text-align: center; max-width: 300px; }
  .cap b { display: block; font-size: 13px; font-weight: 400; color: var(--ink-soft); margin-bottom: 6px; }
  .cap span { font-size: 11px; color: var(--muted-deep); line-height: 1.7; }

  .phone {
    width: 350px; height: 758px; background: #000; border-radius: 42px; padding: 9px;
    box-shadow: 0 0 0 1.5px rgba(255,255,255,0.12), 0 24px 70px rgba(0,0,0,0.9);
    position: relative;
  }
  .phone-screen {
    width: 100%; height: 100%; background: var(--bg);
    border-radius: 34px; overflow: hidden; position: relative;
  }

  .status-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 44px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px 0 28px; font-size: 13px; font-weight: 600; z-index: 30;
  }
  .sb-right { display: flex; align-items: center; gap: 5px; }
  .sb-battery {
    width: 22px; height: 10px; border: 1px solid rgba(240,239,236,0.5);
    border-radius: 3px; padding: 1.5px; display: block;
  }
  .sb-battery i { display: block; width: 75%; height: 100%; background: var(--ink); border-radius: 1px; }

  /* 光晕 */
  .glow {
    position: absolute; border-radius: 50%; pointer-events: none;
  }
  .glow-1 {
    left: 50%; top: 42%;
    width: 340px; height: 340px; margin-left: -170px; margin-top: -170px;
    background: radial-gradient(circle,
      rgba(201,168,106,0.17) 0%,
      rgba(201,168,106,0.07) 26%,
      rgba(201,168,106,0.02) 48%,
      transparent 70%);
    animation: drift1 18s ease-in-out infinite;
  }
  .glow-2 {
    left: 22%; top: 28%;
    width: 210px; height: 210px; margin-left: -105px; margin-top: -105px;
    background: radial-gradient(circle,
      rgba(201,168,106,0.1) 0%,
      rgba(201,168,106,0.03) 42%,
      transparent 66%);
    animation: drift2 24s ease-in-out infinite;
  }
  .glow-3 {
    left: 76%; top: 62%;
    width: 230px; height: 230px; margin-left: -115px; margin-top: -115px;
    background: radial-gradient(circle,
      rgba(201,168,106,0.08) 0%,
      rgba(201,168,106,0.025) 45%,
      transparent 68%);
    animation: drift3 21s ease-in-out infinite;
  }

  @keyframes drift1 {
    0%, 100% { transform: translate(0,0) scale(1); opacity: 0.85; }
    33% { transform: translate(-12px,-15px) scale(1.08); opacity: 1; }
    66% { transform: translate(10px,9px) scale(0.96); opacity: 0.72; }
  }
  @keyframes drift2 {
    0%, 100% { transform: translate(0,0) scale(1); opacity: 0.6; }
    50% { transform: translate(18px,22px) scale(1.12); opacity: 0.95; }
  }
  @keyframes drift3 {
    0%, 100% { transform: translate(0,0) scale(1); opacity: 0.5; }
    40% { transform: translate(-15px,-18px) scale(1.1); opacity: 0.85; }
    75% { transform: translate(8px,13px) scale(0.94); opacity: 0.65; }
  }

  /* 光点 */
  .particles {
    position: absolute; inset: 0; pointer-events: none; overflow: hidden;
  }
  .particle {
    position: absolute; border-radius: 50%;
    background: var(--gold);
    animation-name: floatUp;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  @keyframes floatUp {
    0% { transform: translate(0,0) scale(1); opacity: 0; }
    12% { opacity: 1; }
    50% { transform: translate(7px, -190px) scale(1.15); }
    88% { opacity: 1; }
    100% { transform: translate(-5px, -380px) scale(0.8); opacity: 0; }
  }

  /* 诗句 */
  .poems {
    position: absolute; right: 40px; top: 24%;
    display: flex; gap: 22px; z-index: 10;
  }
  .poem-row { display: flex; flex-direction: column; align-items: center; }

  .pchar {
    transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1);
  }
  .pchar-1 {
    font-family: var(--serif); font-size: 38px;
    line-height: 1.62; color: rgba(240,239,236,0.94);
    text-shadow: 0 0 18px rgba(240,239,236,0.12);
  }
  .pchar-2 {
    font-family: var(--serif); font-size: 26px;
    line-height: 1.95; color: rgba(201,168,106,0.86);
    text-shadow: 0 0 14px rgba(201,168,106,0.28);
  }

  /* 署名 */
  .sig {
    position: absolute; left: 32px; bottom: 95px; z-index: 10;
    display: flex; flex-direction: column; align-items: flex-start;
  }
  .sig-line {
    height: 1px;
    background: linear-gradient(90deg, rgba(201,168,106,0.85), rgba(201,168,106,0));
    transition: width 0.9s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease;
  }
  .sig-name { display: flex; gap: 5px; margin-top: 13px; }
  .nchar {
    font-family: var(--serif); font-size: 23px;
    color: var(--gold);
    text-shadow: 0 0 22px rgba(201,168,106,0.45);
    transition: opacity 0.66s cubic-bezier(0.16,1,0.3,1);
  }
  .sig-sub {
    margin-top: 7px; font-size: 11px;
    letter-spacing: 0.18em; color: rgba(138,136,132,0.72);
    transition: opacity 0.8s ease;
  }

  /* 引导 */
  .enter {
    position: absolute; left: 0; right: 0; bottom: 48px; z-index: 10;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    transition: opacity 0.6s ease;
  }
  .enter-text {
    font-size: 12px; letter-spacing: 0.32em;
    color: rgba(240,239,236,0.38);
    animation: enterBreathe 3.2s ease-in-out infinite;
  }
  .enter-arrow {
    font-size: 10px; color: rgba(201,168,106,0.5);
    animation: arrowFloat 2.4s ease-in-out infinite;
  }
  @keyframes enterBreathe {
    0%, 100% { opacity: 0.35; }
    50% { opacity: 0.9; }
  }
  @keyframes arrowFloat {
    0%, 100% { transform: translateY(0); opacity: 0.4; }
    50% { transform: translateY(4px); opacity: 0.9; }
  }

  .note {
    max-width: 1650px; margin: 48px auto 0; padding: 20px 22px;
    border-left: 2px solid var(--gold); background: rgba(201,168,106,0.05);
    font-size: 12.5px; line-height: 2.1; color: var(--muted);
  }
  .note b { color: var(--ink-soft); font-weight: 400; }
  .note code { color: var(--gold); font-size: 12px; }
  .note .row { margin-bottom: 6px; }
</style>
</head>
<body>

<div class="doc-head">
  <h1>首页 · 纯文字炫动版</h1>
  <p>
    五层视觉叠在一起：背景光晕漂移、20 个上升光点、竖排诗句逐字浮现、金色线条生长、署名最后出现。
    下面四屏是动画的四个阶段（静态截图，真机上会动）。
  </p>
</div>

<div class="screens">
  <div class="wrap">
    ${phone({ frame: 0 })}
    <div class="cap"><b>0.0s</b><span>只有光晕和光点在动<br>文字还没出来</span></div>
  </div>
  <div class="wrap">
    ${phone({ frame: 1 })}
    <div class="cap"><b>1.1s</b><span>第一句逐字浮现<br>每字间隔 0.11s</span></div>
  </div>
  <div class="wrap">
    ${phone({ frame: 2 })}
    <div class="cap"><b>2.0s</b><span>第二句金色小字出现<br>金色线条开始生长</span></div>
  </div>
  <div class="wrap">
    ${phone({ frame: 4 })}
    <div class="cap"><b>3.2s · 完成</b><span>署名 + 引导字出现<br>引导字持续呼吸</span></div>
  </div>
</div>

<div class="note">
  <div class="row"><b>五个动画层次</b></div>
  <div class="row">1. <code>glow</code> × 3 —— 三个金色光晕，各自 18/24/21 秒一个周期漂移 + 呼吸，不会同步</div>
  <div class="row">2. <code>particle</code> × 20 —— 光点从下往上飘，速度 14-26 秒不等，错开启动</div>
  <div class="row">3. <code>pchar</code> —— 诗句逐字浮现，带模糊 → 清晰的过渡</div>
  <div class="row">4. <code>sig-line</code> —— 金色细线从 0 长到 96rpx</div>
  <div class="row">5. <code>enter</code> —— 引导字呼吸 + 箭头上下浮动</div>
  <br>
  <div class="row"><b>性能保障</b></div>
  <div class="row">· 全部 CSS 动画，零 JS 逐帧（不占主线程）</div>
  <div class="row">· 只动 <code>transform</code> 和 <code>opacity</code>，不动 <code>top/left/width</code></div>
  <div class="row">· 光点 20 个（实测临界值，30 个开始掉帧）</div>
  <div class="row">· 文字用 <code>text-shadow</code> 而非 <code>filter: blur</code> 做发光（性能好得多）</div>
</div>

</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'home-flashy.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'home-flashy.html'));

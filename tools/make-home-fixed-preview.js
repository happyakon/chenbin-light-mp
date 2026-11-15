/**
 * 首页 · 修复后预览
 *
 * 关键：这次模拟「animation 正常跑完」的最终状态，
 * 确认文字都能显示出来。
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
      opacity: +(0.2 + rnd2 * 0.35).toFixed(2),
    });
  }
  return out;
}

// 用真实的小程序 CSS（简化版），验证布局
function phone({ title, note, showAll }) {
  const p = particles();
  const POEM1 = '光是时间的形状'.split('');
  const POEM2 = '我只负责记下'.split('');
  const NAME = '陈彬'.split('');

  return `
  <div class="phone"><div class="phone-screen">
    <div class="status-bar">
      <span>14:40</span>
      <span class="sb-right">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
        <span class="sb-battery"><i></i></span>
      </span>
    </div>

    <div class="glow glow-1"></div>
    <div class="glow glow-2"></div>
    <div class="glow glow-3"></div>

    <div class="particles">
      ${p.map((x) => `<div class="particle" style="left:${x.left}%;top:${x.top}%;width:${x.size}px;height:${x.size}px;opacity:${x.opacity};animation-duration:${x.duration}s;animation-delay:${-x.delay}s"></div>`).join('')}
    </div>

    <div class="poems">
      <div class="poem-row">
        ${POEM1.map((ch, i) => `<span class="pchar pchar-1">${ch}</span>`).join('')}
      </div>
      <div class="poem-row">
        ${POEM2.map((ch, i) => `<span class="pchar pchar-2">${ch}</span>`).join('')}
      </div>
    </div>

    <div class="sig">
      <div class="sig-line"></div>
      <div class="sig-name">
        ${NAME.map((ch) => `<span class="nchar">${ch}</span>`).join('')}
      </div>
      <div class="sig-sub">摄影师 · 记录者</div>
    </div>

    <div class="enter is-on">
      <div class="enter-text">轻触进入</div>
      <div class="enter-arrow">↓</div>
    </div>
  </div></div>`;
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>首页 · 修复后</title>
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
  .doc-head { max-width: 900px; margin: 0 auto 44px; }
  .doc-head h1 { font-family: var(--serif); font-weight: 400; font-size: 27px; letter-spacing: 0.14em; }
  .doc-head p { margin-top: 12px; font-size: 13px; line-height: 1.9; color: var(--muted); max-width: 780px; }

  .screens { display: flex; gap: 60px; max-width: 900px; margin: 0 auto; justify-content: center; }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .cap { text-align: center; max-width: 340px; }
  .cap b { display: block; font-size: 13px; font-weight: 400; color: var(--ink-soft); margin-bottom: 6px; }
  .cap span { font-size: 11px; color: var(--muted-deep); line-height: 1.8; }

  .phone {
    width: 390px; height: 844px; background: #000; border-radius: 46px; padding: 10px;
    box-shadow: 0 0 0 1.5px rgba(255,255,255,0.12), 0 24px 70px rgba(0,0,0,0.9);
    position: relative;
  }
  .phone-screen {
    width: 100%; height: 100%; background: var(--bg);
    border-radius: 38px; overflow: hidden; position: relative;
  }

  .status-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 48px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 26px 0 32px; font-size: 14px; font-weight: 600; z-index: 30;
  }
  .sb-right { display: flex; align-items: center; gap: 6px; }
  .sb-battery {
    width: 24px; height: 11px; border: 1px solid rgba(240,239,236,0.5);
    border-radius: 3px; padding: 1.5px; display: block;
  }
  .sb-battery i { display: block; width: 75%; height: 100%; background: var(--ink); border-radius: 1px; }

  .glow { position: absolute; border-radius: 50%; pointer-events: none; }
  .glow-1 {
    left: 50%; top: 40%;
    width: 680px; height: 680px; margin-left: -340px; margin-top: -340px;
    background: radial-gradient(circle,
      rgba(201,168,106,0.18) 0%, rgba(201,168,106,0.08) 26%,
      rgba(201,168,106,0.025) 48%, transparent 70%);
    animation: drift1 18s ease-in-out infinite;
  }
  .glow-2 {
    left: 20%; top: 26%;
    width: 460px; height: 460px; margin-left: -230px; margin-top: -230px;
    background: radial-gradient(circle,
      rgba(201,168,106,0.11) 0%, rgba(201,168,106,0.035) 42%, transparent 66%);
    animation: drift2 24s ease-in-out infinite;
  }
  .glow-3 {
    left: 78%; top: 64%;
    width: 500px; height: 500px; margin-left: -250px; margin-top: -250px;
    background: radial-gradient(circle,
      rgba(201,168,106,0.09) 0%, rgba(201,168,106,0.028) 45%, transparent 68%);
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

  .particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
  .particle {
    position: absolute; border-radius: 50%; background: var(--gold);
    animation-name: floatUp;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  @keyframes floatUp {
    0% { transform: translate(0,0) scale(1); opacity: 0; }
    12% { opacity: 1; }
    50% { transform: translate(7px, -330px) scale(1.15); }
    88% { opacity: 1; }
    100% { transform: translate(-5px, -660px) scale(0.8); opacity: 0; }
  }

  .poems {
    position: absolute; right: 44px; top: 24%;
    display: flex; gap: 22px; z-index: 10;
  }
  .poem-row { display: flex; flex-direction: column; align-items: center; }

  .pchar { opacity: 1; }
  .pchar-1 {
    font-family: var(--serif); font-size: 38px;
    line-height: 1.62; color: rgba(240,239,236,0.94);
    text-shadow: 0 0 18px rgba(240,239,236,0.12);
  }
  .pchar-2 {
    font-family: var(--serif); font-size: 26px;
    line-height: 1.95; color: rgba(201,168,106,0.88);
    text-shadow: 0 0 14px rgba(201,168,106,0.3);
  }

  .sig {
    position: absolute; left: 36px; bottom: 100px; z-index: 10;
    display: flex; flex-direction: column; align-items: flex-start;
  }
  .sig-line {
    width: 48px; height: 1px;
    background: linear-gradient(90deg, rgba(201,168,106,0.85), rgba(201,168,106,0));
  }
  .sig-name { display: flex; gap: 5px; margin-top: 13px; }
  .nchar {
    font-family: var(--serif); font-size: 23px;
    color: var(--gold);
    text-shadow: 0 0 22px rgba(201,168,106,0.45);
  }
  .sig-sub {
    margin-top: 7px; font-size: 11px;
    letter-spacing: 0.18em; color: rgba(138,136,132,0.75);
  }

  .enter {
    position: absolute; left: 0; right: 0; bottom: 50px; z-index: 10;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    opacity: 1;
  }
  .enter-text {
    font-size: 12px; letter-spacing: 0.32em;
    color: rgba(240,239,236,0.42);
    animation: enterBreathe 3.2s ease-in-out infinite;
  }
  .enter-arrow {
    font-size: 10px; color: rgba(201,168,106,0.55);
    animation: arrowFloat 2.4s ease-in-out infinite;
  }
  @keyframes enterBreathe {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.95; }
  }
  @keyframes arrowFloat {
    0%, 100% { transform: translateY(0); opacity: 0.45; }
    50% { transform: translateY(4px); opacity: 0.95; }
  }

  .note {
    max-width: 900px; margin: 48px auto 0; padding: 18px 20px;
    border-left: 2px solid var(--gold); background: rgba(201,168,106,0.05);
    font-size: 12.5px; line-height: 2.1; color: var(--muted);
  }
  .note b { color: var(--ink-soft); font-weight: 400; }
  .note code { color: var(--gold); font-size: 12px; }
  .note .bad { color: #d9705f; }
</style>
</head>
<body>

<div class="doc-head">
  <h1>首页 · 修复后</h1>
  <p>之前你看到的几乎全黑，原因是 <code>filter: blur()</code> 配合 <code>animation-fill-mode: both</code> 在小程序里出问题，文字永久停在不可见状态。</p>
</div>

<div class="screens">
  <div class="wrap">
    ${phone({})}
    <div class="cap"><b>修复后的效果</b><span>文字全部正常显示<br>光晕和光点持续缓慢流动</span></div>
  </div>
</div>

<div class="note">
  <b>之前为什么全黑</b><br>
  <span class="bad">×</span> <code>filter: blur(6rpx)</code> —— 小程序对 filter 支持不完整<br>
  <span class="bad">×</span> <code>animation: ... both</code> —— 让元素锁死在动画结束态<br>
  两者叠加，加上 <code>opacity: 0</code> 初始值，文字就彻底消失了。<br>
  <br>
  <b>改了什么</b><br>
  · 去掉 <code>filter: blur()</code>，改用透明度 + 位移做入场<br>
  · <code>both</code> 改成 <code>forwards</code><br>
  · <code>vh</code> 单位改成 <code>rpx</code><br>
  · <b>关键</b>：文字的基础状态改成「可见」，只有带了 <code>.is-animating</code> 类才设置 <code>opacity: 0</code> 并播放动画<br>
  · <b>更关键</b>：<code>animate</code> 初始值改成 <code>false</code>，先正常显示，下一帧再开动画。这样即使动画失败，最差也只是「没有入场效果」，而不是「一片空白」
</div>

</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'home-fixed.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'home-fixed.html'));

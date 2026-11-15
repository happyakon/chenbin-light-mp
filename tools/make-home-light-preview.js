/**
 * 首页介绍页预览 · 带光效的山景
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots', 'mp-proto');

const STARS = [
  [8, 14, 0, 3.2], [19, 32, 1.1, 4.1], [27, 8, 2.4, 3.6], [34, 41, 0.6, 4.8],
  [43, 19, 3.2, 3.4], [51, 36, 1.8, 4.4], [58, 11, 2.9, 3.9], [66, 28, 0.3, 5.1],
  [74, 44, 3.7, 3.3], [81, 16, 1.5, 4.6], [89, 33, 2.2, 3.7], [12, 52, 4.0, 4.2],
  [23, 61, 1.3, 3.5], [38, 55, 2.7, 4.9], [47, 66, 0.9, 3.8], [62, 58, 3.5, 4.3],
  [77, 68, 1.9, 3.1], [92, 57, 2.6, 4.7],
];

// 远山 SVG（曲线山脊 + 渐变）
const FAR_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 390 150' preserveAspectRatio='none'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23383229'/%3E%3Cstop offset='45%25' stop-color='%23221f1c'/%3E%3Cstop offset='100%25' stop-color='%23151412'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M0,150 L0,86 C18,80 26,58 46,55 C68,52 78,74 102,72 C124,70 134,44 162,46 C188,48 196,72 222,70 C248,68 258,40 286,46 C310,51 318,74 346,70 C366,67 378,54 390,58 L390,150 Z' fill='url(%23g)'/%3E%3C/svg%3E`;

// 近山 SVG
const NEAR_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 390 110' preserveAspectRatio='none'%3E%3Cpath d='M0,110 L0,72 C24,64 38,38 66,42 C90,45 100,68 128,66 C154,64 164,34 192,38 C216,41 228,64 254,62 C278,60 290,36 316,44 C338,51 352,70 390,62 L390,110 Z' fill='%230a0a09'/%3E%3C/svg%3E`;

function phone() {
  return `
  <div class="phone"><div class="screen">
    <div class="status-bar">
      <span>15:35</span>
      <span class="sb-right">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
        <span class="sb-battery"><i></i></span>
      </span>
    </div>

    <div class="index-page">
      <div class="head">
        <div class="welcome">欢迎来到我的拾光集</div>
        <div class="title">陈彬拾光集</div>
        <div class="subtitle">我将去往山川湖海，在天地之间拾光。</div>
      </div>

      <div class="scene">
        <div class="stars">
          ${STARS.map(([l, t, d, dur]) => `<div class="star" style="left:${l}%;top:${t}%;animation-delay:${d}s;animation-duration:${dur}s"></div>`).join('')}
        </div>

        <div class="light-outer"></div>
        <div class="light-inner"></div>

        <div class="mountain-far" style="background-image:url(&quot;${FAR_SVG}&quot;)"></div>
        <div class="mountain-near" style="background-image:url(&quot;${NEAR_SVG}&quot;)"></div>
      </div>

      <div class="card">
        <div class="card-title">拾光者</div>
        <div class="card-body">一名热爱摄影的程序员，一心奔赴山野，用镜头记录自然的精妙。</div>
      </div>

      <div class="enter">
        <div class="enter-line"></div>
        <div class="enter-text">轻触进入</div>
        <div class="enter-arrow">↓</div>
      </div>
    </div>

    <div class="native-tabbar">
      <div class="ntab is-active">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V21H3z"/></svg>
        <span>首页</span>
      </div>
      <div class="ntab">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        <span>摄影集</span>
      </div>
      <div class="ntab">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
        <span>我的</span>
      </div>
      <div class="ntab">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01"/><path d="M11 12h1v4"/></svg>
        <span>关于</span>
      </div>
    </div>
    <div class="home-indicator"></div>
  </div></div>`;
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>首页 · 带光效的山景</title>
<style>
  :root {
    --gold: #c9a86a;
    --serif: "Songti SC","SimSun",Georgia,serif;
    --sans: -apple-system, "PingFang SC", "Helvetica Neue", sans-serif;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #030303; padding: 44px 36px 72px;
    font-family: var(--sans); -webkit-font-smoothing: antialiased;
  }
  .doc-head { max-width: 900px; margin: 0 auto 44px; }
  .doc-head h1 { font-family: var(--serif); font-weight: 400; font-size: 27px; letter-spacing: 0.14em; color: #f0efec; }
  .doc-head p { margin-top: 12px; font-size: 13px; line-height: 1.9; color: #8a8884; max-width: 780px; }

  .stage { display: flex; justify-content: center; gap: 60px; }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .cap { text-align: center; max-width: 380px; }
  .cap b { display: block; font-size: 13px; font-weight: 400; color: #c8c6c1; margin-bottom: 6px; }
  .cap span { font-size: 11px; color: #5a5956; line-height: 1.8; }

  .phone {
    width: 390px; height: 844px; background: #000; border-radius: 46px; padding: 10px;
    box-shadow: 0 0 0 1.5px rgba(255,255,255,0.12), 0 24px 70px rgba(0,0,0,0.9);
    position: relative;
  }
  .screen {
    width: 100%; height: 100%;
    border-radius: 38px; overflow: hidden; position: relative;
  }

  .status-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 48px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 26px 0 32px; font-size: 14px; font-weight: 600;
    color: #f0efec; z-index: 40;
  }
  .sb-right { display: flex; align-items: center; gap: 6px; }
  .sb-battery {
    width: 24px; height: 11px; border: 1px solid rgba(240,239,236,0.5);
    border-radius: 3px; padding: 1.5px; display: block;
  }
  .sb-battery i { display: block; width: 75%; height: 100%; background: #f0efec; border-radius: 1px; }

  /* 页面：带天光渐变 */
  .index-page {
    position: absolute; inset: 0;
    padding-bottom: 70px;
    display: flex; flex-direction: column;
    background: linear-gradient(to bottom,
      #080808 0%, #080808 38%, #0c0b0a 58%,
      #12100d 78%, #0a0a09 100%);
  }

  .head { flex: 0 0 auto; padding: 88px 24px 0; }

  .welcome {
    font-family: var(--serif); font-size: 17px;
    letter-spacing: 0.12em; color: rgba(201,168,106,0.9);
  }
  .title {
    margin-top: 16px;
    font-family: var(--serif); font-size: 48px;
    font-weight: 400; letter-spacing: 0.06em; line-height: 1.1;
    color: #f2f1ee;
    text-shadow: 0 0 30px rgba(255,255,255,0.1);
  }
  .subtitle {
    margin-top: 13px; font-size: 13.5px;
    letter-spacing: 0.06em; line-height: 1.7;
    color: rgba(200,198,193,0.62);
  }

  .scene { flex: 1; position: relative; min-height: 0; overflow: hidden; }

  .stars { position: absolute; inset: 0; z-index: 1; }
  .star {
    position: absolute; width: 2px; height: 2px;
    border-radius: 50%; background: #dedbd3;
    animation-name: twinkle;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }
  @keyframes twinkle {
    0%, 100% { opacity: 0.15; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }

  /* 光 */
  .light-outer {
    position: absolute; left: 50%; bottom: 8%;
    width: 426px; height: 250px; margin-left: -213px;
    border-radius: 50%;
    background: radial-gradient(ellipse at center,
      rgba(228,188,118,0.26) 0%,
      rgba(201,168,106,0.14) 22%,
      rgba(201,168,106,0.05) 45%,
      transparent 72%);
    z-index: 2;
    animation: lightBreathe 7s ease-in-out infinite;
  }
  .light-inner {
    position: absolute; left: 50%; bottom: 13%;
    width: 177px; height: 73px; margin-left: -88px;
    border-radius: 50%;
    background: radial-gradient(ellipse at center,
      rgba(245,215,155,0.5) 0%,
      rgba(228,188,118,0.22) 35%,
      transparent 70%);
    z-index: 2;
    animation: lightBreathe 7s ease-in-out 1.2s infinite;
  }
  @keyframes lightBreathe {
    0%, 100% { opacity: 0.65; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }

  /* 山 */
  .mountain-far {
    position: absolute; left: 0; right: 0; bottom: 48px;
    height: 156px; z-index: 3;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .mountain-near {
    position: absolute; left: 0; right: 0; bottom: 0;
    height: 114px; z-index: 4;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  /* 卡片 */
  .card {
    flex: 0 0 auto; margin: 0 24px; padding: 21px 23px;
    border-radius: 10px;
    background: rgba(24,23,22,0.78);
    border: 1px solid rgba(240,239,236,0.06);
    position: relative; z-index: 20;
  }
  .card-title {
    font-family: var(--serif); font-size: 20px;
    letter-spacing: 0.1em; color: var(--gold);
  }
  .card-body {
    margin-top: 10px; font-size: 13.5px;
    line-height: 1.9; letter-spacing: 0.03em;
    color: rgba(200,198,193,0.66);
  }

  /* 引导 */
  .enter {
    flex: 0 0 auto;
    display: flex; flex-direction: column; align-items: center;
    padding: 23px 0 20px;
    position: relative; z-index: 20;
  }
  .enter-line {
    width: 156px; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,106,0.5), transparent);
  }
  .enter-text {
    margin-top: 15px; font-size: 12.5px;
    letter-spacing: 0.2em; color: rgba(201,168,106,0.8);
    animation: enterBreathe 3s ease-in-out infinite;
  }
  .enter-arrow {
    margin-top: 7px; font-size: 11px;
    color: rgba(201,168,106,0.55);
    animation: arrowFloat 2.4s ease-in-out infinite;
  }
  @keyframes enterBreathe {
    0%, 100% { opacity: 0.45; }
    50% { opacity: 1; }
  }
  @keyframes arrowFloat {
    0%, 100% { transform: translateY(0); opacity: 0.5; }
    50% { transform: translateY(4px); opacity: 1; }
  }

  .native-tabbar {
    position: absolute; left: 0; right: 0; bottom: 0;
    height: 50px; padding-bottom: 20px;
    background: rgba(13,13,13,0.96);
    border-top: 1px solid rgba(240,239,236,0.08);
    display: flex; z-index: 100;
  }
  .ntab {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 3px;
    color: #5a5956; font-size: 10px;
  }
  .ntab.is-active { color: var(--gold); }

  .home-indicator {
    position: absolute; bottom: 9px; left: 50%; transform: translateX(-50%);
    width: 134px; height: 5px; border-radius: 3px;
    background: rgba(240,239,236,0.5); z-index: 40;
  }

  .note {
    max-width: 900px; margin: 48px auto 0; padding: 18px 20px;
    border-left: 2px solid var(--gold); background: rgba(201,168,106,0.05);
    font-size: 12.5px; line-height: 2.1; color: #8a8884;
  }
  .note b { color: #c8c6c1; font-weight: 400; }
  .note code { color: var(--gold); font-size: 12px; }
</style>
</head>
<body>

<div class="doc-head">
  <h1>首页 · 带光效的山景</h1>
  <p>山用 SVG 曲线画（不是硬边多边形），中间三层光叠加，模拟光从山后透出来。</p>
</div>

<div class="stage">
  <div class="wrap">
    ${phone()}
    <div class="cap">
      <b>首页</b>
      <span>光在山后呼吸<br>星星各自闪烁<br>整体天光是纵向渐变</span>
    </div>
  </div>
</div>

<div class="note">
  <b>关于那道光</b><br>
  三层叠加：<br>
  · <code>light-outer</code> —— 大范围柔和金光（426×250px），照亮天空下部<br>
  · <code>light-inner</code> —— 小而亮的核（177×73px），像远处城镇灯火<br>
  · 两个都有 7 秒周期的呼吸动画，相互错开 1.2 秒<br>
  <br>
  <b>关于山</b><br>
  用 SVG 贝塞尔曲线画山脊：<code>M0,150 L0,86 C18,80 26,58 46,55 C68,52...</code><br>
  曲线而不是直线，所以山脊是圆润起伏的，不是尖锐折角。<br>
  远山顶部有纵向渐变（<code>#383229</code> → <code>#151412</code>），模拟被光照亮。<br>
  <br>
  <b>关于整体天光</b><br>
  页面背景是纵向渐变：顶部纯黑 <code>#080808</code>，到地平线附近变暖 <code>#12100d</code>，<br>
  底部再收回深色。这样即使不看光晕，也能感到"下面是亮的"。
</div>

</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'home-light.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'home-light.html'));

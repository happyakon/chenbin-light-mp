/**
 * 首页改版原型 · 纯文字介绍（不用照片）
 *
 * 3 个方案：
 *   A. 极简书法 + 缓慢浮现
 *   B. 竖排诗句 + 金色线条动画
 *   C. 大字滚动 + 视差
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots', 'mp-proto');

const statusBar = `
  <div class="status-bar">
    <span>15:20</span>
    <span class="sb-right">
      <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
      <span class="sb-battery"><i></i></span>
    </span>
  </div>`;

function phone(content) {
  return `
  <div class="phone"><div class="phone-screen">
    ${statusBar}
    ${content}
    <div class="tabbar">
      <div class="tab is-active"><span class="ti">⌂</span><span>首页</span></div>
      <div class="tab"><span class="ti">▦</span><span>摄影集</span></div>
      <div class="tab"><span class="ti">◔</span><span>我的</span></div>
    </div>
    <div class="home-indicator"></div>
  </div></div>`;
}

/* ============ 方案 A：极简书法 ============ */
const layoutA = `
  <div class="page page-a">
    <div class="a-glow"></div>
    <div class="a-rings">
      <div class="ring ring-1"></div>
      <div class="ring ring-2"></div>
      <div class="ring ring-3"></div>
    </div>
    <div class="a-center">
      <div class="a-title">拾 光</div>
      <div class="a-en">CHEN BIN</div>
      <div class="a-line"></div>
      <div class="a-desc">记录光线落下的每一刻</div>
    </div>
    <div class="a-enter">轻触进入</div>
  </div>`;

/* ============ 方案 B：竖排诗句 ============ */
const layoutB = `
  <div class="page page-b">
    <div class="b-glow"></div>
    <div class="b-vertical">
      <div class="b-poem">光 是 时 间 的 形 状</div>
      <div class="b-poem b-poem-2">我 只 负 责 记 下</div>
    </div>
    <div class="b-bottom">
      <div class="b-name">陈 彬</div>
      <div class="b-sub">摄影师 · 记录者</div>
    </div>
    <div class="b-enter">轻触进入 →</div>
  </div>`;

/* ============ 方案 C：大字 + 渐变 ============ */
const layoutC = `
  <div class="page page-c">
    <div class="c-glow"></div>
    <div class="c-top">
      <div class="c-over">WELCOME TO</div>
      <div class="c-brand">陈彬拾光集</div>
    </div>
    <div class="c-mid">
      <div class="c-big">LIGHT</div>
      <div class="c-big c-big-2">COLLECTION</div>
    </div>
    <div class="c-bot">
      <div class="c-quote">「每一帧，都是光经过的样子」</div>
      <div class="c-enter">轻触进入摄影集</div>
    </div>
  </div>`;

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>首页改版 · 纯文字介绍</title>
<style>
  :root {
    --bg: #0a0a0a; --ink: #f0efec; --ink-soft: #c8c6c1;
    --muted: #8a8884; --muted-deep: #5a5956; --gold: #c9a86a;
    --serif: "Songti SC","SimSun",Georgia,serif;
    --sans: -apple-system, "PingFang SC", "Helvetica Neue", sans-serif;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #060606; color: var(--ink); font-family: var(--sans);
    padding: 44px 36px 72px; -webkit-font-smoothing: antialiased;
  }
  .doc-head { max-width: 1350px; margin: 0 auto 44px; }
  .doc-head h1 { font-family: var(--serif); font-weight: 400; font-size: 27px; letter-spacing: 0.14em; }
  .doc-head p { margin-top: 12px; font-size: 13px; line-height: 1.9; color: var(--muted); max-width: 820px; }

  .screens { display: flex; gap: 44px; max-width: 1350px; margin: 0 auto; }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .cap { text-align: center; max-width: 330px; }
  .cap b { display: block; font-size: 13.5px; font-weight: 400; color: var(--ink-soft); margin-bottom: 6px; letter-spacing: 0.06em; }
  .cap span { font-size: 11.5px; color: var(--muted-deep); line-height: 1.8; }

  .phone {
    width: 390px; height: 844px; background: #000; border-radius: 46px; padding: 10px;
    box-shadow: 0 0 0 1.5px rgba(255,255,255,0.12), 0 24px 70px rgba(0,0,0,0.9);
    position: relative;
  }
  .phone-screen {
    width: 100%; height: 100%; background: #0a0a0a;
    border-radius: 38px; overflow: hidden; position: relative;
  }

  .status-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 48px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 26px 0 32px; font-size: 14px; font-weight: 600; z-index: 40;
    color: rgba(240,239,236,0.9);
  }
  .sb-right { display: flex; align-items: center; gap: 6px; }
  .sb-battery {
    width: 24px; height: 11px; border: 1px solid rgba(240,239,236,0.5);
    border-radius: 3px; padding: 1.5px; display: block;
  }
  .sb-battery i { display: block; width: 75%; height: 100%; background: var(--ink); border-radius: 1px; }

  .tabbar {
    position: absolute; left: 0; right: 0; bottom: 0; height: 50px;
    padding-bottom: 20px; background: rgba(13,13,13,0.96);
    border-top: 1px solid rgba(240,239,236,0.08);
    display: flex; z-index: 100;
  }
  .tab {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 3px;
    color: var(--muted-deep); font-size: 10px;
  }
  .tab.is-active { color: var(--gold); }
  .ti { font-size: 17px; line-height: 1; }

  .home-indicator {
    position: absolute; bottom: 9px; left: 50%; transform: translateX(-50%);
    width: 134px; height: 5px; border-radius: 3px;
    background: rgba(240,239,236,0.5); z-index: 40;
  }

  .page { position: absolute; inset: 0; overflow: hidden; }

  /* ==================== A：极简书法 ==================== */
  .page-a { display: flex; align-items: center; justify-content: center; }

  .a-glow {
    position: absolute; left: 50%; top: 48%;
    width: 620px; height: 620px; margin-left: -310px; margin-top: -310px;
    border-radius: 50%;
    background: radial-gradient(circle,
      rgba(201,168,106,0.16) 0%,
      rgba(201,168,106,0.07) 28%,
      rgba(201,168,106,0.02) 50%,
      transparent 70%);
    animation: breathe 5s ease-in-out infinite;
  }
  @keyframes breathe {
    0%, 100% { opacity: 0.75; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.06); }
  }

  .a-rings { position: absolute; inset: 0; display: grid; place-items: center; }
  .ring {
    position: absolute; border-radius: 50%;
    border: 1px solid rgba(201,168,106,0.09);
  }
  .ring-1 { width: 250px; height: 250px; animation: ringPulse 5s ease-in-out infinite; }
  .ring-2 { width: 340px; height: 340px; border-color: rgba(201,168,106,0.05); animation: ringPulse 5s ease-in-out 0.6s infinite; }
  .ring-3 { width: 430px; height: 430px; border-color: rgba(201,168,106,0.025); animation: ringPulse 5s ease-in-out 1.2s infinite; }
  @keyframes ringPulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.04); }
  }

  .a-center { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; }

  .a-title {
    font-family: var(--serif); font-size: 62px; letter-spacing: 0.34em;
    color: var(--gold); text-indent: 0.34em;
    text-shadow: 0 0 54px rgba(201,168,106,0.42), 0 0 110px rgba(201,168,106,0.18);
    animation: fadeUpSlow 1.4s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes fadeUpSlow {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .a-en {
    margin-top: 26px; font-size: 9px; letter-spacing: 0.42em;
    color: rgba(201,168,106,0.48); text-indent: 0.42em;
    animation: fadeUpSlow 1.4s cubic-bezier(0.16,1,0.3,1) 0.3s both;
  }

  .a-line {
    margin-top: 34px; width: 52px; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,106,0.7), transparent);
    animation: fadeUpSlow 1.4s cubic-bezier(0.16,1,0.3,1) 0.5s both;
  }

  .a-desc {
    margin-top: 34px; font-size: 12px; letter-spacing: 0.24em;
    color: rgba(200,198,193,0.5); text-indent: 0.24em;
    animation: fadeUpSlow 1.4s cubic-bezier(0.16,1,0.3,1) 0.7s both;
  }

  .a-enter {
    position: absolute; left: 0; right: 0; bottom: 110px;
    text-align: center; font-size: 11.5px; letter-spacing: 0.28em;
    color: rgba(240,239,236,0.32); text-indent: 0.28em;
    animation: enterBreathe 3s ease-in-out infinite;
  }
  @keyframes enterBreathe {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.85; }
  }

  /* ==================== B：竖排诗句 ==================== */
  .page-b { display: flex; flex-direction: column; }

  .b-glow {
    position: absolute; left: 30%; top: 40%;
    width: 520px; height: 520px; margin-left: -260px; margin-top: -260px;
    border-radius: 50%;
    background: radial-gradient(circle,
      rgba(201,168,106,0.1) 0%,
      rgba(201,168,106,0.03) 40%,
      transparent 68%);
  }

  .b-vertical {
    position: absolute; right: 62px; top: 130px;
    display: flex; flex-direction: column; gap: 18px;
    writing-mode: vertical-rl;
  }

  .b-poem {
    font-family: var(--serif); font-size: 30px; line-height: 1.9;
    letter-spacing: 0.28em; color: rgba(240,239,236,0.88);
    animation: poemIn 1.2s cubic-bezier(0.16,1,0.3,1) both;
  }
  .b-poem-2 {
    font-size: 22px; color: rgba(201,168,106,0.75);
    animation-delay: 0.35s;
  }
  @keyframes poemIn {
    from { opacity: 0; transform: translateY(-24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .b-bottom {
    position: absolute; left: 40px; bottom: 150px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .b-name {
    font-family: var(--serif); font-size: 30px;
    letter-spacing: 0.24em; color: var(--gold);
  }
  .b-sub { font-size: 12px; letter-spacing: 0.16em; color: rgba(138,136,132,0.7); }

  .b-enter {
    position: absolute; left: 40px; bottom: 108px;
    font-size: 11.5px; letter-spacing: 0.18em;
    color: rgba(240,239,236,0.32);
    animation: enterBreathe 3s ease-in-out infinite;
  }

  /* ==================== C：大字 + 渐变 ==================== */
  .page-c { display: flex; flex-direction: column; padding: 100px 40px 130px; }

  .c-glow {
    position: absolute; left: 50%; top: 45%;
    width: 700px; height: 700px; margin-left: -350px; margin-top: -350px;
    border-radius: 50%;
    background: radial-gradient(circle,
      rgba(201,168,106,0.1) 0%,
      rgba(201,168,106,0.03) 45%,
      transparent 70%);
  }

  .c-top { position: relative; z-index: 2; }
  .c-over {
    font-size: 9.5px; letter-spacing: 0.4em;
    color: rgba(201,168,106,0.55);
    animation: fadeUpSlow 1.2s cubic-bezier(0.16,1,0.3,1) both;
  }
  .c-brand {
    margin-top: 14px;
    font-family: var(--serif); font-size: 32px;
    letter-spacing: 0.1em; color: var(--ink);
    animation: fadeUpSlow 1.2s cubic-bezier(0.16,1,0.3,1) 0.15s both;
  }

  .c-mid {
    position: relative; z-index: 2;
    flex: 1; display: flex; flex-direction: column;
    justify-content: center; gap: 0;
  }
  .c-big {
    font-family: var(--serif); font-size: 58px;
    letter-spacing: 0.06em; line-height: 1.05;
    color: transparent;
    -webkit-text-stroke: 1px rgba(201,168,106,0.55);
    animation: fadeUpSlow 1.4s cubic-bezier(0.16,1,0.3,1) 0.35s both;
  }
  .c-big-2 {
    color: transparent;
    -webkit-text-stroke: 1px rgba(240,239,236,0.3);
    animation-delay: 0.55s;
  }

  .c-bot { position: relative; z-index: 2; }
  .c-quote {
    font-size: 12.5px; letter-spacing: 0.08em; line-height: 1.9;
    color: rgba(200,198,193,0.55);
    animation: fadeUpSlow 1.4s cubic-bezier(0.16,1,0.3,1) 0.8s both;
  }
  .c-enter {
    margin-top: 26px; font-size: 11.5px; letter-spacing: 0.22em;
    color: rgba(201,168,106,0.7);
    animation: enterBreathe 3s ease-in-out infinite;
  }

  .note {
    max-width: 1350px; margin: 48px auto 0; padding: 18px 20px;
    border-left: 2px solid var(--gold); background: rgba(201,168,106,0.05);
    font-size: 12px; line-height: 2; color: var(--muted);
  }
  .note b { color: var(--ink-soft); font-weight: 400; }
</style>
</head>
<body>

<div class="doc-head">
  <h1>首页改版 · 纯文字介绍</h1>
  <p>不用任何照片，全靠排版、字距、微光和动画做出质感。三个方向，风格差别很大。</p>
</div>

<div class="screens">
  <div class="wrap">
    ${phone(layoutA)}
    <div class="cap">
      <b>方案 A · 极简书法</b>
      <span>一个「拾光」大字居中，配三层呼吸圆环和金色微光。<br>最安静，最像画廊前台。</span>
    </div>
  </div>

  <div class="wrap">
    ${phone(layoutB)}
    <div class="cap">
      <b>方案 B · 竖排诗句</b>
      <span>中文竖排从右上往下走，左下角署名。<br>最有文人气，像书画册扉页。</span>
    </div>
  </div>

  <div class="wrap">
    ${phone(layoutC)}
    <div class="cap">
      <b>方案 C · 大字描边</b>
      <span>英文大字用描边（不填充），顶部品牌名。<br>最现代，最有设计感。</span>
    </div>
  </div>
</div>

<div class="note">
  <b>三个方案的共同点</b><br>
  · 全部纯 CSS 绘制，不用一张图片，包体积几乎不增加<br>
  · 都带<b>呼吸动画</b>（微光、圆环、引导字），静态截图看不出来，真机会动<br>
  · 都有淡淡的金色径向微光，让纯黑底不显得死<br>
  · 底部「轻触进入」是唯一的操作入口<br>
  <br>
  <b>如果你想「更炫」</b><br>
  可以加：粒子效果、鼠标跟随光斑、文字逐字浮现、背景缓慢流动的噪点纹理。
  但要注意<b>性能</b>——小程序动画掉帧比网页明显，宁可少做几个效果做流畅。
</div>

</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'home-redesign.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'home-redesign.html'));

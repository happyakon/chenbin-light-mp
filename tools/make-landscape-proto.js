/**
 * 横图查看方案对比原型
 *
 * 三种方案：
 *   A. 竖屏（现状）：照片居中，上下留大黑边
 *   B. 页面内 CSS 旋转：不依赖系统设置，照片铺满
 *   C. 信息条移到侧边（真横屏布局）
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'shots', 'mp-proto');
const IMG = (n) => `./${n}`;

// 用一张横图做示范
const LANDSCAPE_PHOTO = 'scenery-0.jpg';

function statusBar() {
  return `
    <div class="status-bar">
      <span class="sb-time">9:41</span>
      <span class="sb-right">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><path d="M8 10.5 5.2 7.6a4 4 0 0 1 5.6 0L8 10.5Zm0-5.2a7.5 7.5 0 0 0-5.3 2.2L1 5.8a9.8 9.8 0 0 1 14 0l-1.7 1.7A7.5 7.5 0 0 0 8 5.3Z"/></svg>
        <span class="sb-battery"><i></i></span>
      </span>
    </div>`;
}

/* ---------- 方案 A：竖屏（现状） ---------- */
function screenA() {
  return `
  <div class="phone phone-vertical">
    <div class="phone-screen">
      ${statusBar()}
      <div class="page">
        <div class="ab-top"><span class="ab-back">‹</span></div>
        <!-- 横图在竖屏里，只能占中间一条 -->
        <div class="photo-center" style="background-image:url('${IMG(LANDSCAPE_PHOTO)}')"></div>
        <div class="ab-info">
          <div class="ab-line1">
            <span class="ab-album">山水之间</span>
            <span class="ab-count">1 / 19</span>
          </div>
          <div class="ab-line2">
            <span class="ab-like">♡ <b>12</b></span>
            <span class="ab-fav">☆</span>
          </div>
        </div>
        <div class="rot-hint">↻ 点这里横过来看</div>
      </div>
      <div class="home-indicator"></div>
    </div>
  </div>`;
}

/* ---------- 方案 B：页面内旋转 ---------- */
function screenB() {
  return `
  <div class="phone phone-vertical">
    <div class="phone-screen">
      ${statusBar()}
      <div class="page page-rotated">
        <!-- 一个旋转 90 度的容器，尺寸按屏幕宽高对调 -->
        <div class="rot-stage">
          <div class="rot-photo" style="background-image:url('${IMG(LANDSCAPE_PHOTO)}')"></div>
          <div class="rot-info">
            <span class="rot-album">山水之间 · 1 / 19</span>
            <span class="rot-actions">♡ 12　☆　↺ 竖回来</span>
          </div>
        </div>
      </div>
      <div class="home-indicator"></div>
    </div>
  </div>`;
}

/* ---------- 方案 C：真横屏布局（信息条在侧边） ---------- */
function screenC() {
  // 用一个横置的手机外壳模拟
  return `
  <div class="phone phone-horizontal">
    <div class="phone-screen">
      <div class="page page-landscape">
        <div class="lp-photo" style="background-image:url('${IMG(LANDSCAPE_PHOTO)}')"></div>
        <div class="lp-side">
          <span class="lp-album">山水之间</span>
          <span class="lp-count">1 / 19</span>
          <div class="lp-acts">
            <span class="lp-act">♡ 12</span>
            <span class="lp-act">☆</span>
            <span class="lp-act">↺</span>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>横图查看方案对比</title>
<style>
  :root {
    --bg: #0d0d0d; --panel: #141414;
    --ink: #f0efec; --ink-soft: #c8c6c1;
    --muted: #8a8884; --muted-deep: #5a5956; --gold: #c9a86a;
    --serif: "Songti SC","SimSun",Georgia,serif;
    --sans: -apple-system, "PingFang SC", "Helvetica Neue", sans-serif;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #0a0a0a; color: var(--ink);
    font-family: var(--sans);
    padding: 48px 40px 80px;
    -webkit-font-smoothing: antialiased;
  }
  .doc-head { max-width: 1500px; margin: 0 auto 44px; }
  .doc-head h1 {
    font-family: var(--serif); font-weight: 400; font-size: 28px;
    letter-spacing: 0.14em;
  }
  .doc-head p {
    margin-top: 16px; font-size: 13px; line-height: 1.9;
    color: var(--muted); max-width: 780px;
  }

  .screens { display: flex; flex-wrap: wrap; gap: 50px 44px; max-width: 1500px; margin: 0 auto; }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .cap { text-align: center; max-width: 400px; }
  .cap b { display: block; font-size: 14px; font-weight: 400; letter-spacing: 0.06em; color: var(--ink-soft); margin-bottom: 7px; }
  .cap span { display: block; font-size: 11.5px; line-height: 1.8; color: var(--muted-deep); }
  .cap .tag {
    display: inline-block; margin-bottom: 8px; padding: 3px 9px;
    font-size: 9.5px; letter-spacing: 0.1em; border-radius: 3px;
  }
  .tag-ok { background: rgba(201,168,106,0.16); color: var(--gold); }
  .tag-neutral { background: rgba(240,239,236,0.07); color: var(--muted); }

  /* 手机 */
  .phone {
    background: #000; border-radius: 46px; padding: 10px;
    box-shadow: 0 0 0 1.5px rgba(255,255,255,0.12), 0 24px 70px rgba(0,0,0,0.85);
    position: relative;
  }
  .phone-vertical { width: 390px; height: 844px; }
  .phone-horizontal { width: 844px; height: 390px; border-radius: 46px; }
  .phone-screen {
    width: 100%; height: 100%; background: var(--bg);
    border-radius: 38px; overflow: hidden; position: relative;
  }
  .page { position: absolute; inset: 0; }

  .status-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 48px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 26px 0 32px;
    font-size: 14px; font-weight: 600; z-index: 30;
  }
  .sb-right { display: flex; align-items: center; gap: 6px; }
  .sb-battery {
    width: 24px; height: 11px; border: 1px solid rgba(240,239,236,0.5);
    border-radius: 3px; padding: 1.5px; display: block; position: relative;
  }
  .sb-battery::after {
    content: ''; position: absolute; right: -3px; top: 3px;
    width: 1.5px; height: 5px; background: rgba(240,239,236,0.5);
  }
  .sb-battery i { display: block; width: 75%; height: 100%; background: var(--ink); border-radius: 1px; }
  .home-indicator {
    position: absolute; bottom: 9px; left: 50%; transform: translateX(-50%);
    width: 134px; height: 5px; border-radius: 3px;
    background: rgba(240,239,236,0.6); z-index: 30;
  }

  /* ---------- A：竖屏现状 ---------- */
  .ab-top {
    position: absolute; top: 48px; left: 0; right: 0; height: 44px;
    display: flex; align-items: center; padding: 0 16px; z-index: 25;
  }
  .ab-back {
    width: 34px; height: 34px; border-radius: 50%;
    background: rgba(0,0,0,0.4); backdrop-filter: blur(8px);
    display: grid; place-items: center; font-size: 22px; color: var(--ink-soft);
    padding-bottom: 3px;
  }
  .photo-center {
    position: absolute; inset: 0;
    background-size: contain; background-position: center; background-repeat: no-repeat;
    background-color: #000;
  }
  .ab-info {
    position: absolute; left: 0; right: 0; bottom: 0;
    padding: 18px 22px 40px; z-index: 20;
    background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0));
  }
  .ab-line1 { display: flex; align-items: baseline; justify-content: space-between; }
  .ab-album { font-family: var(--serif); font-size: 16px; letter-spacing: 0.1em; color: var(--ink); }
  .ab-count { font-size: 12px; color: rgba(255,255,255,0.5); }
  .ab-line2 { display: flex; justify-content: space-between; margin-top: 12px; }
  .ab-like { font-size: 15px; color: rgba(255,255,255,0.75); }
  .ab-like b { font-weight: 400; font-size: 13px; }
  .ab-fav { font-size: 18px; color: rgba(255,255,255,0.6); }
  .rot-hint {
    position: absolute; right: 22px; bottom: 128px; z-index: 22;
    padding: 7px 13px; border-radius: 16px;
    background: rgba(201,168,106,0.16); border: 1px solid rgba(201,168,106,0.4);
    font-size: 11px; letter-spacing: 0.06em; color: var(--gold);
  }

  /* ---------- B：页面内旋转 ---------- */
  /*
   * 做法：
   * 1. 外层 .rot-outer 是竖屏尺寸（390×844），用 flex 居中
   * 2. 内层 .rot-stage 做成横屏尺寸（844×390），旋转 90°
   * 3. 旋转是围绕自身中心，配合 flex 居中，视觉上正好铺满
   */
  .page-rotated {
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .rot-stage {
    flex: 0 0 auto;
    width: 844px;
    height: 390px;
    transform: rotate(90deg);
    transform-origin: center center;
    display: flex;
    flex-direction: column;
    background: #000;
  }
  .rot-photo {
    flex: 1;
    min-height: 0;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }
  .rot-info {
    flex: 0 0 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    border-top: 1px solid rgba(240,239,236,0.08);
  }
  .rot-album {
    font-family: var(--serif); font-size: 13px; letter-spacing: 0.08em;
    color: var(--ink-soft);
  }
  .rot-actions {
    font-size: 12px; color: rgba(255,255,255,0.6); letter-spacing: 0.08em;
  }

  /* ---------- C：真横屏 ---------- */
  .page-landscape { background: #000; display: flex; }
  .lp-photo {
    flex: 1;
    background-size: contain; background-position: center; background-repeat: no-repeat;
  }
  .lp-side {
    width: 74px; flex: 0 0 74px;
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 22px;
    border-left: 1px solid rgba(240,239,236,0.08);
  }
  .lp-album {
    font-family: var(--serif); font-size: 12px; letter-spacing: 0.1em;
    color: var(--ink-soft); writing-mode: vertical-rl;
  }
  .lp-count { font-size: 10px; color: var(--muted-deep); }
  .lp-acts { display: flex; flex-direction: column; gap: 16px; align-items: center; }
  .lp-act { font-size: 14px; color: rgba(255,255,255,0.65); }

  .note {
    max-width: 1500px; margin: 50px auto 0; padding: 16px 18px;
    border-left: 2px solid var(--gold); background: rgba(201,168,106,0.05);
    font-size: 12px; line-height: 2; color: var(--muted);
  }
  .note b { color: var(--ink-soft); font-weight: 400; }
</style>
</head>
<body>

<div class="doc-head">
  <h1>横图查看方案对比</h1>
  <p>
    横构图照片在竖屏手机里只能占中间一条，上下大片黑边。
    下面是三种处理方式，都基于同一张横图（3:2 风光照）。
  </p>
</div>

<div class="screens">

  <div class="wrap">
    ${screenA()}
    <div class="cap">
      <span class="tag tag-neutral">方案 A · 现状</span>
      <b>竖屏直接看</b>
      <span>照片只占中间一条，上下大量黑边。<br>想看清细节只能靠双指放大。</span>
    </div>
  </div>

  <div class="wrap">
    ${screenB()}
    <div class="cap">
      <span class="tag tag-ok">方案 B · 推荐</span>
      <b>页面内旋转（不依赖系统设置）</b>
      <span>点一下，照片在页面内旋转 90° 铺满全屏。<br>
      与手机是否开启「自动旋转」无关，所有设备行为一致。</span>
    </div>
  </div>

  <div class="wrap">
    ${screenC()}
    <div class="cap">
      <span class="tag tag-neutral">方案 C · 真横屏</span>
      <b>横屏布局（信息条移到侧边）</b>
      <span>需要手机开启自动旋转才会触发。<br>
      体验最自然，但依赖用户系统设置，且要做两套布局。</span>
    </div>
  </div>

</div>

<div class="note">
  <b>关键差异</b><br>
  · <b>方案 B</b> 用 CSS <code>transform: rotate(90deg)</code> 实现，不依赖
    <code>pageOrientation</code> 配置，也不受手机「方向锁定」影响 —— 用户点了就转，可靠。<br>
  · <b>方案 C</b> 依赖系统方向设置。很多人长期开着「方向锁定」（尤其是躺着看手机时），
    导致横过来也没用，体验不确定。<br>
  · 两种方案工作量差别不大，但 B 的可控性高得多。
</div>

</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'landscape-compare.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'landscape-compare.html'));

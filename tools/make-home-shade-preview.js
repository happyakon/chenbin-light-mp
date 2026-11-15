/**
 * 首页 · 背景图 + 渐变 效果预览
 *
 * 用真实的背景图，对比渐变调整前后的差异
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots', 'mp-proto');
const BG_SRC = path.join(__dirname, '..', '..', 'chenbin-light', 'photos', 'home', 'bg.jpg');

// 背景图转 base64 内联，避免路径问题
const bgB64 = fs.existsSync(BG_SRC)
  ? 'data:image/jpeg;base64,' + fs.readFileSync(BG_SRC).toString('base64')
  : '';

function phone({ old }) {
  return `
  <div class="phone"><div class="screen">
    <div class="bg-photo" style="background-image:url('${bgB64}')"></div>

    <!-- 顶部渐变 -->
    <div class="bg-shade-top ${old ? 'old' : ''}"></div>
    <!-- 底部渐变 -->
    <div class="bg-shade-bottom ${old ? 'old' : ''}"></div>

    <div class="content">
      <div class="status-bar">
        <span>16:15</span>
        <span class="sb-right">
          <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
          <span class="sb-battery"><i></i></span>
        </span>
      </div>

      <div class="head">
        <div class="welcome">欢迎来到我的拾光集</div>
        <div class="title">陈彬拾光集</div>
        <div class="subtitle">我将去往山川湖海，在天地之间拾光。</div>
      </div>

      <div class="spacer"></div>

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

    <div class="tabbar">
      <div class="tab is-active"><span class="ti">⌂</span><span>首页</span></div>
      <div class="tab"><span class="ti">▦</span><span>摄影集</span></div>
      <div class="tab"><span class="ti">◔</span><span>我的</span></div>
      <div class="tab"><span class="ti">ⓘ</span><span>关于</span></div>
    </div>
    <div class="home-indicator"></div>
  </div></div>`;
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>首页 · 渐变调整对比</title>
<style>
  :root {
    --gold: #c9a86a;
    --serif: "Songti SC","SimSun",Georgia,serif;
    --sans: -apple-system, "PingFang SC", "Helvetica Neue", sans-serif;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #030303; padding: 40px 32px 70px;
    font-family: var(--sans); -webkit-font-smoothing: antialiased;
  }
  .doc-head { max-width: 1000px; margin: 0 auto 40px; }
  .doc-head h1 { font-family: var(--serif); font-weight: 400; font-size: 26px; letter-spacing: 0.14em; color: #f0efec; }
  .doc-head p { margin-top: 12px; font-size: 13px; line-height: 1.9; color: #8a8884; max-width: 820px; }

  .stage { display: flex; justify-content: center; gap: 50px; }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .cap { text-align: center; max-width: 360px; }
  .cap b { display: block; font-size: 13px; font-weight: 400; color: #c8c6c1; margin-bottom: 6px; }
  .cap span { font-size: 11px; color: #5a5956; line-height: 1.8; }

  .phone {
    width: 390px; height: 844px; background: #000; border-radius: 46px; padding: 10px;
    box-shadow: 0 0 0 1.5px rgba(255,255,255,0.12), 0 24px 70px rgba(0,0,0,0.9);
    position: relative;
  }
  .screen {
    width: 100%; height: 100%; background: #080808;
    border-radius: 38px; overflow: hidden; position: relative;
  }

  /* 背景照片 */
  .bg-photo {
    position: absolute; inset: 0;
    background-size: cover;
    background-position: center;
    z-index: 1;
  }

  /* ===== 新的顶部渐变 ===== */
  .bg-shade-top {
    position: absolute; left: 0; right: 0; top: 0;
    height: 52%;
    background: linear-gradient(to bottom,
      rgba(0,0,0,0.88) 0%,
      rgba(0,0,0,0.78) 25%,
      rgba(0,0,0,0.55) 50%,
      rgba(0,0,0,0.22) 75%,
      transparent 100%);
    z-index: 2;
  }
  /* ===== 旧的顶部渐变（对比用） ===== */
  .bg-shade-top.old {
    height: 46%;
    background: linear-gradient(to bottom,
      rgba(0,0,0,0.82) 0%,
      rgba(0,0,0,0.55) 40%,
      rgba(0,0,0,0.15) 75%,
      transparent 100%);
  }

  /* ===== 新的底部渐变 ===== */
  .bg-shade-bottom {
    position: absolute; left: 0; right: 0; bottom: 0;
    height: 42%;
    background: linear-gradient(to top,
      rgba(0,0,0,0.95) 0%,
      rgba(0,0,0,0.82) 28%,
      rgba(0,0,0,0.45) 62%,
      transparent 100%);
    z-index: 2;
  }
  /* ===== 旧的底部渐变 ===== */
  .bg-shade-bottom.old {
    height: 55%;
    background: linear-gradient(to top,
      rgba(0,0,0,0.92) 0%,
      rgba(0,0,0,0.7) 35%,
      rgba(0,0,0,0.3) 70%,
      transparent 100%);
  }

  /* 内容层 */
  .content {
    position: absolute; inset: 0;
    padding-bottom: 70px;
    display: flex; flex-direction: column;
    z-index: 10;
  }

  .status-bar {
    flex: 0 0 48px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 26px 0 32px; font-size: 14px; font-weight: 600;
    color: #f0efec;
  }
  .sb-right { display: flex; align-items: center; gap: 6px; }
  .sb-battery {
    width: 24px; height: 11px; border: 1px solid rgba(240,239,236,0.5);
    border-radius: 3px; padding: 1.5px; display: block;
  }
  .sb-battery i { display: block; width: 75%; height: 100%; background: #f0efec; border-radius: 1px; }

  .head { flex: 0 0 auto; padding: 20px 24px 0; }

  .welcome {
    font-family: var(--serif); font-size: 17px;
    letter-spacing: 0.12em; color: rgba(201,168,106,0.92);
    text-shadow: 0 1px 10px rgba(0,0,0,0.8);
  }
  .title {
    margin-top: 16px;
    font-family: var(--serif); font-size: 48px;
    font-weight: 400; letter-spacing: 0.06em; line-height: 1.1;
    color: #f5f4f1;
    text-shadow: 0 2px 16px rgba(0,0,0,0.75);
  }
  .subtitle {
    margin-top: 13px; font-size: 13.5px;
    letter-spacing: 0.06em; line-height: 1.7;
    color: rgba(232,230,226,0.78);
    text-shadow: 0 1px 8px rgba(0,0,0,0.7);
  }

  .spacer { flex: 1; min-height: 0; }

  .card {
    flex: 0 0 auto; margin: 0 24px; padding: 20px 22px;
    border-radius: 10px;
    background: rgba(18,17,16,0.72);
    border: 1px solid rgba(240,239,236,0.1);
    backdrop-filter: blur(15px);
  }
  .card-title {
    font-family: var(--serif); font-size: 20px;
    letter-spacing: 0.1em; color: #d4b47a;
  }
  .card-body {
    margin-top: 10px; font-size: 13px;
    line-height: 1.9; letter-spacing: 0.03em;
    color: rgba(220,218,214,0.78);
  }

  .enter {
    flex: 0 0 auto;
    display: flex; flex-direction: column; align-items: center;
    padding: 22px 0 20px;
  }
  .enter-line {
    width: 156px; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,106,0.55), transparent);
  }
  .enter-text {
    margin-top: 15px; font-size: 12.5px;
    letter-spacing: 0.2em; color: rgba(201,168,106,0.85);
    text-shadow: 0 1px 8px rgba(0,0,0,0.8);
  }
  .enter-arrow {
    margin-top: 7px; font-size: 11px;
    color: rgba(201,168,106,0.6);
  }

  /* tabBar */
  .tabbar {
    position: absolute; left: 0; right: 0; bottom: 0;
    height: 50px; padding-bottom: 20px;
    background: rgba(13,13,13,0.96);
    border-top: 1px solid rgba(240,239,236,0.08);
    display: flex; z-index: 100;
  }
  .tab {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 3px;
    color: #5a5956; font-size: 10px;
  }
  .tab.is-active { color: var(--gold); }
  .ti { font-size: 17px; line-height: 1; }

  .home-indicator {
    position: absolute; bottom: 9px; left: 50%; transform: translateX(-50%);
    width: 134px; height: 5px; border-radius: 3px;
    background: rgba(240,239,236,0.5); z-index: 40;
  }

  .note {
    max-width: 1000px; margin: 44px auto 0; padding: 18px 20px;
    border-left: 2px solid var(--gold); background: rgba(201,168,106,0.05);
    font-size: 12.5px; line-height: 2.1; color: #8a8884;
  }
  .note b { color: #c8c6c1; font-weight: 400; }
  .note code { color: var(--gold); font-size: 12px; }
</style>
</head>
<body>

<div class="doc-head">
  <h1>首页 · 渐变调整对比</h1>
  <p>左边是调整前，右边是调整后。重点看副标题是否清楚、山峰是否露出来。</p>
</div>

<div class="stage">
  <div class="wrap">
    ${phone({ old: true })}
    <div class="cap"><b>调整前</b><span>副标题压在山峰亮部<br>底部渐变压掉太多山体</span></div>
  </div>
  <div class="wrap">
    ${phone({ old: false })}
    <div class="cap"><b>调整后</b><span>顶部渐变加深加长<br>底部渐变收缩，露出更多山</span></div>
  </div>
</div>

<div class="note">
  <b>顶部渐变</b><br>
  高度 <code>46% → 52%</code>，中段不透明度 <code>0.55 → 0.78</code><br>
  从 5 段渐变改成 5 段更平滑的过渡，避免出现明显分界线<br>
  <br>
  <b>底部渐变</b><br>
  高度 <code>55% → 42%</code>，但底部浓度 <code>0.92 → 0.95</code> 提高<br>
  效果：卡片区域依然够暗（文字清楚），但山体露出更多
</div>

</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'home-shade.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'home-shade.html'));
console.log('背景图:', fs.existsSync(BG_SRC) ? '已内联' : '❌ 找不到');

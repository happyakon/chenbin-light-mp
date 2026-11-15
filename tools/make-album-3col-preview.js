/**
 * 相册页 · 宽封面 + 3 列瀑布流 预览
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots', 'mp-proto');

// 模拟「最小高度优先」分列的结果
const COL1 = ['kids-0.jpg', 'kids-3.jpg', 'people-2.jpg'];
const COL2 = ['kids-2.jpg', 'people-0.jpg', 'kids-4.jpg'];
const COL3 = ['kids-1.jpg', 'kids-5.jpg', 'kids-4.jpg'];

const colHtml = (imgs) =>
  imgs.map((img) => `<div class="m-item"><img class="m-img" src="${img}" /></div>`).join('');

function phone({ cover, title, count, withResume }) {
  return `
  <div class="phone"><div class="phone-screen">
    <div class="wall-scroll">
      <div class="hero">
        <img class="hero-img" src="${cover}" />
        <div class="hero-mask"></div>
        <div class="hero-back">‹</div>
        <div class="hero-text">
          <div class="hero-title">${title}</div>
          <div class="hero-count">${count} 张图片</div>
        </div>
      </div>

      ${
        withResume
          ? `<div class="resume-tip">
               <span class="rt-text">上次看到第 8 张</span>
               <span class="rt-btn">继续看</span>
               <span class="rt-close">×</span>
             </div>`
          : ''
      }

      <div class="masonry">
        <div class="m-col">${colHtml(COL1)}</div>
        <div class="m-col">${colHtml(COL2)}</div>
        <div class="m-col">${colHtml(COL3)}</div>
      </div>
    </div>

    <div class="status-bar">
      <span>14:02</span>
      <span class="sb-right">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
        <span class="sb-battery"><i></i></span>
      </span>
    </div>

    <div class="capsule">
      <span class="dots">•••</span>
      <span class="divider"></span>
      <span class="circle"></span>
    </div>
  </div></div>`;
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>相册页 · 宽封面 + 3 列</title>
<style>
  :root {
    --bg: #0d0d0d; --ink: #f0efec; --ink-soft: #c8c6c1;
    --muted: #8a8884; --muted-deep: #5a5956; --gold: #c9a86a;
    --serif: "Songti SC","SimSun",Georgia,serif;
    --sans: -apple-system, "PingFang SC", "Helvetica Neue", sans-serif;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #0a0a0a; color: var(--ink); font-family: var(--sans);
    padding: 44px 36px 72px; -webkit-font-smoothing: antialiased;
  }
  .doc-head { max-width: 1250px; margin: 0 auto 40px; }
  .doc-head h1 { font-family: var(--serif); font-weight: 400; font-size: 27px; letter-spacing: 0.14em; }
  .doc-head p { margin-top: 12px; font-size: 13px; line-height: 1.9; color: var(--muted); max-width: 820px; }

  .screens { display: flex; gap: 48px; max-width: 1250px; margin: 0 auto; }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .cap { text-align: center; max-width: 330px; }
  .cap b { display: block; font-size: 13px; font-weight: 400; color: var(--ink-soft); margin-bottom: 5px; }
  .cap span { font-size: 11px; color: var(--muted-deep); line-height: 1.7; }

  .phone {
    width: 390px; height: 844px; background: #000; border-radius: 46px; padding: 10px;
    box-shadow: 0 0 0 1.5px rgba(255,255,255,0.12), 0 22px 60px rgba(0,0,0,0.8);
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
    color: #fff; text-shadow: 0 1px 6px rgba(0,0,0,0.75);
  }
  .sb-right { display: flex; align-items: center; gap: 6px; }
  .sb-battery {
    width: 24px; height: 11px; border: 1px solid rgba(255,255,255,0.65);
    border-radius: 3px; padding: 1.5px; display: block;
  }
  .sb-battery i { display: block; width: 75%; height: 100%; background: #fff; border-radius: 1px; }

  .capsule {
    position: absolute; right: 14px; top: 54px; z-index: 50;
    width: 87px; height: 32px; border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.25);
    background: rgba(0,0,0,0.35);
    backdrop-filter: blur(10px);
    display: flex; align-items: center; justify-content: space-around;
    color: #fff; font-size: 13px;
  }
  .capsule .dots { letter-spacing: 1px; }
  .capsule .circle {
    width: 16px; height: 16px; border-radius: 50%;
    border: 1.5px solid #fff; display: flex; align-items: center; justify-content: center;
  }
  .capsule .circle::after { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #fff; }
  .capsule .divider { width: 1px; height: 16px; background: rgba(255,255,255,0.25); }

  .wall-scroll { position: absolute; inset: 0; overflow: hidden; }

  /* 4:3 宽封面 */
  .hero {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: #141414;
  }
  .hero-img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .hero-mask {
    position: absolute; left: 0; right: 0; bottom: 0; height: 45%;
    background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.42) 45%, transparent 100%);
  }
  .hero-back {
    position: absolute; left: 12px; top: 56px;
    width: 34px; height: 34px; border-radius: 50%;
    background: rgba(0,0,0,0.42);
    backdrop-filter: blur(16px);
    display: grid; place-items: center;
    font-size: 22px; color: #fff;
    padding-bottom: 3px;
    z-index: 10;
  }
  .hero-text { position: absolute; left: 16px; right: 16px; bottom: 14px; z-index: 5; }
  .hero-title {
    font-family: var(--serif); font-size: 22px;
    letter-spacing: 0.1em; color: #fff; line-height: 1.25;
    text-shadow: 0 2px 12px rgba(0,0,0,0.75);
  }
  .hero-count {
    margin-top: 4px; font-size: 11px;
    letter-spacing: 0.06em; color: rgba(255,255,255,0.62);
  }

  .resume-tip {
    display: flex; align-items: center; gap: 7px;
    margin: 10px 10px 0; padding: 9px 11px; border-radius: 7px;
    background: rgba(201,168,106,0.1);
    border: 1px solid rgba(201,168,106,0.24);
  }
  .rt-text { flex: 1; font-size: 11.5px; color: var(--gold); }
  .rt-btn {
    flex: 0 0 auto; padding: 4px 11px; border-radius: 9px;
    background: rgba(201,168,106,0.2);
    border: 1px solid rgba(201,168,106,0.38);
    font-size: 11px; color: var(--gold);
  }
  .rt-close {
    flex: 0 0 auto; width: 20px; height: 20px;
    display: grid; place-items: center;
    font-size: 15px; color: #7a7873;
  }

  /* 3 列瀑布流 */
  .masonry { display: flex; gap: 4px; padding: 10px 10px 40px; }
  .m-col { flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .m-item { width: 100%; border-radius: 3px; overflow: hidden; background: #141414; }
  .m-img { width: 100%; display: block; }

  .note {
    max-width: 1250px; margin: 44px auto 0; padding: 16px 18px;
    border-left: 2px solid var(--gold); background: rgba(201,168,106,0.05);
    font-size: 12px; line-height: 2; color: var(--muted);
  }
  .note b { color: var(--ink-soft); font-weight: 400; }
  .note code { color: var(--gold); font-size: 11.5px; }
</style>
</head>
<body>

<div class="doc-head">
  <h1>相册页 · 宽封面 + 3 列瀑布流</h1>
  <p>
    封面从 3:4 竖版改成 4:3 横版，高度砍掉一半。瀑布流从 2 列改成 3 列，
    用「最小高度优先」分列，避免某列特别长。
  </p>
</div>

<div class="screens">
  <div class="wrap">
    ${phone({ cover: 'kids-0.jpg', title: '童年纪事', count: 27, withResume: false })}
    <div class="cap"><b>正常状态</b><span>横版封面 + 3 列瀑布流</span></div>
  </div>
  <div class="wrap">
    ${phone({ cover: 'scenery-0.jpg', title: '山水之间', count: 19, withResume: true })}
    <div class="cap"><b>有断点提示</b><span>封面 + 提示条 + 3 列</span></div>
  </div>
</div>

<div class="note">
  <b>这次改了什么</b><br>
  · 封面 <code>aspect-ratio</code> 从 <code>3/4</code> → <code>4/3</code>，高度从 520px 降到 293px<br>
  · 瀑布流 2 列 → <b>3 列</b>，间距从 12rpx 收到 8rpx<br>
  · 分列算法改成<b>最小高度优先</b>：每张图放进当前最矮的列，三列长度更均衡<br>
  · 封面上标题字号从 26px 收到 22px，遮罩从 55% 收到 45%（不然盖住太多画面）<br>
  <br>
  <b>为什么用「最小高度优先」而不是轮流分</b><br>
  竖图高度是横图的 2 倍多。轮流分（i % 3）会让某些列堆满竖图变得特别长，
  而另一些列全是横图很短，底下留下大片空白。
</div>

</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'album-3col.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'album-3col.html'));

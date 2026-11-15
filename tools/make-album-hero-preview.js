/**
 * 相册页 · 封面 + 瀑布流 预览
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots', 'mp-proto');

const LEFT = ['kids-0.jpg', 'kids-1.jpg', 'people-2.jpg', 'kids-4.jpg'];
const RIGHT = ['kids-2.jpg', 'people-0.jpg', 'kids-3.jpg', 'kids-5.jpg'];

const colHtml = (imgs) =>
  imgs.map((img) => `<div class="m-item"><img class="m-img" src="${img}" /></div>`).join('');

function phone({ withResume, cover }) {
  return `
  <div class="phone"><div class="phone-screen">
    <div class="wall-scroll">
      <!-- 顶部大封面 -->
      <div class="hero">
        <img class="hero-img" src="${cover}" />
        <div class="hero-mask"></div>
        <div class="hero-back">‹</div>
        <div class="hero-text">
          <div class="hero-title">童年纪事</div>
          <div class="hero-count">27 张图片</div>
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
        <div class="m-col">${colHtml(LEFT)}</div>
        <div class="m-col">${colHtml(RIGHT)}</div>
      </div>
    </div>

    <!-- 状态栏浮在最上面 -->
    <div class="status-bar">
      <span>13:36</span>
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
<title>相册页 · 封面 + 瀑布流</title>
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
  .doc-head { max-width: 1100px; margin: 0 auto 40px; }
  .doc-head h1 { font-family: var(--serif); font-weight: 400; font-size: 27px; letter-spacing: 0.14em; }
  .doc-head p { margin-top: 12px; font-size: 13px; line-height: 1.9; color: var(--muted); max-width: 800px; }

  .screens { display: flex; gap: 56px; max-width: 1100px; margin: 0 auto; }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .cap { text-align: center; max-width: 340px; }
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
    color: #fff;
    text-shadow: 0 1px 6px rgba(0,0,0,0.6);
  }
  .sb-right { display: flex; align-items: center; gap: 6px; }
  .sb-battery {
    width: 24px; height: 11px; border: 1px solid rgba(255,255,255,0.6);
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

  .wall-scroll {
    position: absolute; inset: 0;
    overflow: hidden;
  }

  /* 顶部大封面 */
  .hero {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    background: #141414;
  }
  .hero-img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .hero-mask {
    position: absolute; left: 0; right: 0; bottom: 0; height: 55%;
    background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 40%, transparent 100%);
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
  .hero-text {
    position: absolute; left: 18px; right: 18px; bottom: 22px; z-index: 5;
  }
  .hero-title {
    font-family: var(--serif); font-size: 26px;
    letter-spacing: 0.1em; color: #fff; line-height: 1.25;
    text-shadow: 0 2px 12px rgba(0,0,0,0.7);
  }
  .hero-count {
    margin-top: 7px; font-size: 12.5px;
    letter-spacing: 0.06em; color: rgba(255,255,255,0.62);
  }

  /* 断点提示 */
  .resume-tip {
    display: flex; align-items: center; gap: 7px;
    margin: 12px 12px 0; padding: 9px 11px; border-radius: 7px;
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

  /* 瀑布流 */
  .masonry { display: flex; gap: 6px; padding: 12px 12px 40px; }
  .m-col { flex: 1; display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .m-item { width: 100%; border-radius: 4px; overflow: hidden; background: #141414; }
  .m-img { width: 100%; display: block; }

  .note {
    max-width: 1100px; margin: 44px auto 0; padding: 16px 18px;
    border-left: 2px solid var(--gold); background: rgba(201,168,106,0.05);
    font-size: 12px; line-height: 2; color: var(--muted);
  }
  .note b { color: var(--ink-soft); font-weight: 400; }
  .note code { color: var(--gold); font-size: 11.5px; }
</style>
</head>
<body>

<div class="doc-head">
  <h1>相册页 · 封面 + 瀑布流</h1>
  <p>
    顶部 3:4 大封面，标题叠在封面底部。下面是双列瀑布流，按原图比例排。
    没有设置封面的相册，自动用第一张照片。
  </p>
</div>

<div class="screens">
  <div class="wrap">
    ${phone({ withResume: false, cover: 'kids-0.jpg' })}
    <div class="cap"><b>正常状态</b><span>封面 + 标题 + 张数，下滑看更多</span></div>
  </div>
  <div class="wrap">
    ${phone({ withResume: true, cover: 'kids-2.jpg' })}
    <div class="cap"><b>有断点提示</b><span>提示条在封面下方、瀑布流上方</span></div>
  </div>
</div>

<div class="note">
  <b>封面取哪张</b><br>
  · 优先用 Web 控制台给相册设置的封面（<code>albums.cover</code>）<br>
  · 没设置就用<b>第一张照片</b>的 medium 档<br>
  · 后端 <code>/api/mp/albums/photos</code> 现在多返回 <code>album.cover</code> 和 <code>album.coverFile</code><br>
  <br>
  <b>为什么封面用 3:4</b><br>
  和摄影集页的相册卡片比例一致，从列表点进来时视觉连贯，不会有比例跳变。
</div>

</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'album-hero.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'album-hero.html'));

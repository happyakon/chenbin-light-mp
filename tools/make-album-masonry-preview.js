/**
 * 相册页 · 照片墙 + 断点续看 预览
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots', 'mp-proto');

// 竖图、横图混排，模拟真实瀑布流
const LEFT = ['scenery-0.jpg', 'kids-0.jpg', 'people-2.jpg', 'scenery-3.jpg'];
const RIGHT = ['scenery-1.jpg', 'people-0.jpg', 'kids-1.jpg', 'scenery-4.jpg'];

function col(imgs, startIdx) {
  return imgs
    .map(
      (img, i) => `
    <div class="m-item">
      <img class="m-img" src="${img}" />
    </div>`
    )
    .join('');
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>相册页 · 照片墙 + 断点续看</title>
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
  .doc-head { max-width: 1200px; margin: 0 auto 40px; }
  .doc-head h1 { font-family: var(--serif); font-weight: 400; font-size: 27px; letter-spacing: 0.14em; }
  .doc-head p { margin-top: 12px; font-size: 13px; line-height: 1.9; color: var(--muted); max-width: 820px; }

  .screens { display: flex; gap: 50px; max-width: 1200px; margin: 0 auto; }
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
  }
  .sb-right { display: flex; align-items: center; gap: 6px; }
  .sb-battery {
    width: 24px; height: 11px; border: 1px solid rgba(240,239,236,0.5);
    border-radius: 3px; padding: 1.5px; display: block;
  }
  .sb-battery i { display: block; width: 75%; height: 100%; background: var(--ink); border-radius: 1px; }

  .back-btn {
    position: absolute; left: 12px; top: 52px; z-index: 40;
    width: 34px; height: 34px; border-radius: 50%;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(8px);
    display: grid; place-items: center;
    font-size: 22px; color: var(--ink-soft);
    padding-bottom: 3px;
  }

  /* 标题 */
  .grid-head {
    position: absolute; left: 0; right: 0; top: 0; z-index: 20;
    padding: 100px 100px 8px 18px;
    background: linear-gradient(to bottom, #0d0d0d 55%, transparent);
  }
  .gh-title {
    font-family: var(--serif); font-size: 20px;
    letter-spacing: 0.14em; color: var(--ink);
  }
  .gh-count { margin-top: 4px; font-size: 11px; color: var(--muted-deep); }

  /* 断点提示 */
  .resume-tip {
    position: absolute; left: 12px; right: 12px; top: 156px; z-index: 25;
    display: flex; align-items: center; gap: 8px;
    padding: 10px 12px; border-radius: 8px;
    background: rgba(201,168,106,0.12);
    border: 1px solid rgba(201,168,106,0.28);
    backdrop-filter: blur(20px);
  }
  .rt-text { flex: 1; font-size: 12px; color: var(--gold); }
  .rt-btn {
    flex: 0 0 auto; padding: 5px 12px; border-radius: 10px;
    background: rgba(201,168,106,0.2);
    border: 1px solid rgba(201,168,106,0.4);
    font-size: 11.5px; color: var(--gold);
  }
  .rt-close {
    flex: 0 0 auto; width: 22px; height: 22px;
    display: grid; place-items: center; font-size: 16px; color: var(--muted);
  }

  /* 瀑布流 */
  .masonry {
    position: absolute; left: 0; right: 0; top: 0; bottom: 0;
    overflow: hidden;
  }
  .m-inner {
    display: flex; gap: 6px;
    padding: 220px 12px 40px;
  }
  .m-col { flex: 1; display: flex; flex-direction: column; gap: 6px; }
  .m-item {
    width: 100%; border-radius: 4px; overflow: hidden; background: #141414;
  }
  .m-img { width: 100%; display: block; }

  /* 全屏浏览视图 */
  .viewer-stage {
    position: absolute; inset: 0;
    background: #000;
    display: flex; align-items: center; justify-content: center;
  }
  .viewer-img {
    max-width: 100%; max-height: 100%;
    object-fit: contain;
  }
  .slide-hint {
    position: absolute; left: 0; right: 0; bottom: 130px;
    display: flex; flex-direction: column; align-items: center; gap: 4px;
  }
  .hint-arrow { font-size: 12px; color: rgba(255,255,255,0.32); }
  .hint-text { font-size: 10.5px; letter-spacing: 0.16em; color: rgba(255,255,255,0.32); }

  .info-bar {
    position: absolute; left: 0; right: 0; bottom: 0; z-index: 25;
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 20px 24px;
    background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  }
  .ab-album {
    font-family: var(--serif); font-size: 15px;
    letter-spacing: 0.1em; color: var(--ink);
  }
  .ab-count { font-size: 11px; color: rgba(255,255,255,0.45); margin-left: 10px; }
  .info-right { display: flex; align-items: center; gap: 16px; }
  .act { display: flex; align-items: center; gap: 5px; font-size: 18px; color: rgba(255,255,255,0.65); }
  .act-num { font-size: 12px; }

  .note {
    max-width: 1200px; margin: 44px auto 0; padding: 16px 18px;
    border-left: 2px solid var(--gold); background: rgba(201,168,106,0.05);
    font-size: 12px; line-height: 2; color: var(--muted);
  }
  .note b { color: var(--ink-soft); font-weight: 400; }
  .note code { color: var(--gold); font-size: 11.5px; }
</style>
</head>
<body>

<div class="doc-head">
  <h1>相册页 · 照片墙 + 断点续看</h1>
  <p>
    进相册先看到瀑布流照片墙，点某张才进全屏浏览。
    会自动记住看到第几张，下次进来提示「继续看」。
  </p>
</div>

<div class="screens">

  <!-- 视图 1：照片墙 -->
  <div class="wrap">
    <div class="phone"><div class="phone-screen">
      <div class="status-bar">
        <span>13:45</span>
        <span class="sb-right">
          <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
          <span class="sb-battery"><i></i></span>
        </span>
      </div>

      <div class="back-btn">‹</div>

      <div class="grid-head">
        <div class="gh-title">山水之间</div>
        <div class="gh-count">共 19 张</div>
      </div>

      <div class="resume-tip">
        <div class="rt-text">上次看到第 8 张</div>
        <div class="rt-btn">继续看</div>
        <div class="rt-close">×</div>
      </div>

      <div class="masonry">
        <div class="m-inner">
          <div class="m-col">${col(LEFT)}</div>
          <div class="m-col">${col(RIGHT)}</div>
        </div>
      </div>
    </div></div>
    <div class="cap">
      <b>视图 1：瀑布流照片墙</b>
      <span>竖图横图混排，看到什么点什么<br>顶部提示上次看到第几张</span>
    </div>
  </div>

  <!-- 视图 2：全屏浏览 -->
  <div class="wrap">
    <div class="phone"><div class="phone-screen">
      <div class="status-bar">
        <span>13:46</span>
        <span class="sb-right">
          <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
          <span class="sb-battery"><i></i></span>
        </span>
      </div>

      <div class="back-btn">‹</div>

      <div class="viewer-stage">
        <img class="viewer-img" src="scenery-0.jpg" />
        <div class="slide-hint">
          <div class="hint-arrow">⌃</div>
          <div class="hint-text">上滑看参数</div>
        </div>
      </div>

      <div class="info-bar">
        <div>
          <span class="ab-album">山水之间</span>
          <span class="ab-count">8 / 19</span>
        </div>
        <div class="info-right">
          <div class="act">♡ <span class="act-num">12</span></div>
          <div class="act">☆</div>
        </div>
      </div>
    </div></div>
    <div class="cap">
      <b>视图 2：全屏沉浸浏览</b>
      <span>点照片进来，左右滑切换<br>左上角返回回到照片墙</span>
    </div>
  </div>

</div>

<div class="note">
  <b>断点续看的工作方式</b><br>
  · 在全屏浏览时，每次切图都把「第几张」存进 <code>wx.setStorageSync('album_progress_&lt;相册名&gt;', index)</code><br>
  · 下次进同一个相册，读到记录 → 顶部显示「上次看到第 8 张 [继续看]」<br>
  · 点「继续看」直接跳到那张；点 × 关掉提示，从照片墙开始<br>
  · 记录是<b>本地</b>的，不占服务器，换手机不同步（换手机本来就该从头看）
</div>

</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'album-masonry.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'album-masonry.html'));

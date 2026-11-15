/**
 * 收藏/点赞页 · 3 列瀑布流 预览
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots', 'mp-proto');

const COL1 = ['scenery-0.jpg', 'people-2.jpg', 'kids-4.jpg'];
const COL2 = ['kids-0.jpg', 'scenery-1.jpg', 'people-0.jpg'];
const COL3 = ['people-1.jpg', 'kids-3.jpg', 'scenery-2.jpg'];

const colHtml = (imgs) =>
  imgs.map((img) => `<div class="m-item"><img class="m-img" src="${img}" /></div>`).join('');

function phone({ title, count, cols, empty }) {
  return `
  <div class="phone"><div class="phone-screen">
    <div class="status-bar">
      <span>14:15</span>
      <span class="sb-right">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
        <span class="sb-battery"><i></i></span>
      </span>
    </div>

    <div class="nav">
      <div class="back">‹</div>
      <div class="title">${title}</div>
      <div class="count">${count}</div>
    </div>

    ${
      empty
        ? `<div class="state-box">
             <div class="state-dots">· · ·</div>
             <div class="state-text">还没有${title.replace('我的', '')}</div>
             <div class="state-hint">在照片上点${title.includes('收藏') ? ' ☆ 收藏喜欢的照片' : ' ♡ 表示喜欢'}</div>
           </div>`
        : `<div class="masonry">
             <div class="m-col">${colHtml(cols[0])}</div>
             <div class="m-col">${colHtml(cols[1])}</div>
             <div class="m-col">${colHtml(cols[2])}</div>
           </div>`
    }
  </div></div>`;
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>收藏/点赞 · 3 列瀑布流</title>
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
  .doc-head p { margin-top: 12px; font-size: 13px; line-height: 1.9; color: var(--muted); max-width: 800px; }

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
    display: flex; flex-direction: column;
  }

  .status-bar {
    flex: 0 0 48px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 26px 0 32px; font-size: 14px; font-weight: 600;
  }
  .sb-right { display: flex; align-items: center; gap: 6px; }
  .sb-battery {
    width: 24px; height: 11px; border: 1px solid rgba(240,239,236,0.5);
    border-radius: 3px; padding: 1.5px; display: block;
  }
  .sb-battery i { display: block; width: 75%; height: 100%; background: var(--ink); border-radius: 1px; }

  .nav {
    flex: 0 0 auto;
    display: flex; align-items: center;
    padding: 8px 14px 14px; gap: 8px;
  }
  .back {
    width: 28px; font-size: 22px; color: var(--ink-soft);
    line-height: 1; padding-bottom: 3px;
  }
  .title {
    flex: 1; font-family: var(--serif); font-size: 18px;
    letter-spacing: 0.1em; color: var(--ink);
  }
  .count { font-size: 11px; color: var(--muted-deep); }

  .masonry {
    display: flex; gap: 4px;
    padding: 0 10px 40px;
  }
  .m-col { flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .m-item { width: 100%; border-radius: 3px; overflow: hidden; background: #141414; }
  .m-img { width: 100%; display: block; }

  .state-box {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 10px; padding: 60px 30px;
  }
  .state-dots { font-size: 13px; letter-spacing: 0.4em; color: var(--muted-deep); }
  .state-text { font-size: 13px; letter-spacing: 0.08em; color: var(--muted-deep); }
  .state-hint { margin-top: 3px; font-size: 11px; color: #3d3c3a; }

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
  <h1>收藏 / 点赞 · 3 列瀑布流</h1>
  <p>和相册页的照片墙统一视觉：3 列、按原图比例、最小高度优先分列。</p>
</div>

<div class="screens">
  <div class="wrap">
    ${phone({ title: '我的收藏', count: '9 张', cols: [COL1, COL2, COL3], empty: false })}
    <div class="cap"><b>我的收藏</b><span>3 列瀑布流</span></div>
  </div>
  <div class="wrap">
    ${phone({ title: '我的点赞', count: '0 张', cols: [[], [], []], empty: true })}
    <div class="cap"><b>空状态</b><span>没有点赞时的提示</span></div>
  </div>
</div>

<div class="note">
  <b>预览闪烁问题也修了</b><br>
  现象：点照片进原生预览，会先闪一下前几张再跳到当前张。<br>
  原因：<code>wx.previewImage</code> 会先加载 <code>urls[0]</code> 作为初始画面，
  然后才切到 <code>current</code> 指定的那张。<br>
  修法：把当前张排到 <code>urls</code> 第一位，让 <code>urls[0] === current</code>，
  不存在跳转过程。<br>
  代价：预览里只能往后滑，看不到之前的照片（比每次都闪一下好得多）。
</div>

</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'fav-3col.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'fav-3col.html'));

/**
 * 相册照片墙 · 标题栏修复预览
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots', 'mp-proto');

const LEFT = ['scenery-0.jpg', 'kids-0.jpg', 'people-2.jpg', 'scenery-3.jpg'];
const RIGHT = ['scenery-1.jpg', 'people-0.jpg', 'kids-1.jpg', 'scenery-4.jpg'];

const colHtml = (imgs) =>
  imgs.map((img) => `<div class="m-item"><img class="m-img" src="${img}" /></div>`).join('');

function phone(withResume) {
  return `
  <div class="phone"><div class="phone-screen">
    <div class="status-bar">
      <span>13:34</span>
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

    <!-- 实心标题栏 -->
    <div class="grid-head">
      <div class="gh-row">
        <div class="gh-back">‹</div>
        <div class="gh-title-wrap">
          <div class="gh-title">童年纪事</div>
          <div class="gh-count">27 张</div>
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
    </div>

    <div class="masonry-scroll">
      <div class="masonry">
        <div class="m-col">${colHtml(LEFT)}</div>
        <div class="m-col">${colHtml(RIGHT)}</div>
      </div>
    </div>
  </div></div>`;
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>照片墙 · 标题栏修复</title>
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
  .doc-head p { margin-top: 12px; font-size: 13px; line-height: 1.9; color: var(--muted); max-width: 780px; }

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

  .capsule {
    position: absolute; right: 14px; top: 54px; z-index: 50;
    width: 87px; height: 32px; border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.18);
    background: rgba(0,0,0,0.35);
    display: flex; align-items: center; justify-content: space-around;
    color: #fff; font-size: 13px;
  }
  .capsule .dots { letter-spacing: 1px; }
  .capsule .circle {
    width: 16px; height: 16px; border-radius: 50%;
    border: 1.5px solid #fff; display: flex; align-items: center; justify-content: center;
  }
  .capsule .circle::after { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #fff; }
  .capsule .divider { width: 1px; height: 16px; background: rgba(255,255,255,0.2); }

  /* 实心标题栏 */
  .grid-head {
    flex: 0 0 auto;
    padding: 10px 100px 12px 10px;
    background: #0d0d0d;
  }
  .gh-row { display: flex; align-items: center; gap: 6px; }
  .gh-back {
    flex: 0 0 auto;
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(255,255,255,0.05);
    display: grid; place-items: center;
    font-size: 20px; color: var(--ink-soft);
    padding-bottom: 2px;
  }
  .gh-title-wrap {
    flex: 1; min-width: 0;
    display: flex; align-items: baseline; gap: 7px;
  }
  .gh-title {
    font-family: var(--serif); font-size: 19px;
    letter-spacing: 0.12em; color: var(--ink);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .gh-count { flex: 0 0 auto; font-size: 11.5px; color: #6b6a67; }

  .resume-tip {
    display: flex; align-items: center; gap: 7px;
    margin-top: 10px; padding: 9px 11px; border-radius: 7px;
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

  .masonry-scroll { flex: 1; min-height: 0; overflow: hidden; }
  .masonry { display: flex; gap: 6px; padding: 0 12px 40px; }
  .m-col { flex: 1; display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .m-item { width: 100%; border-radius: 4px; overflow: hidden; background: #141414; }
  .m-img { width: 100%; display: block; }

  .note {
    max-width: 1100px; margin: 44px auto 0; padding: 16px 18px;
    border-left: 2px solid var(--gold); background: rgba(201,168,106,0.05);
    font-size: 12px; line-height: 2; color: var(--muted);
  }
  .note b { color: var(--ink-soft); font-weight: 400; }
</style>
</head>
<body>

<div class="doc-head">
  <h1>照片墙 · 标题栏修复</h1>
  <p>
    之前标题栏是绝对定位叠在照片上，渐变边缘有硬线，「共 27 张」的深灰在照片上几乎看不见。
    现在改成实心标题栏，返回键和标题同一行。
  </p>
</div>

<div class="screens">
  <div class="wrap">
    ${phone(false)}
    <div class="cap"><b>无断点提示</b><span>返回键 + 标题 + 张数同一行</span></div>
  </div>
  <div class="wrap">
    ${phone(true)}
    <div class="cap"><b>有断点提示</b><span>提示条在标题下方，独立一块</span></div>
  </div>
</div>

<div class="note">
  <b>改了什么</b><br>
  · 标题栏从 <code>position: absolute</code> 改成正常流式布局，<b>实心 #0d0d0d 背景</b><br>
  · 去掉那个造成硬线的 <code>linear-gradient</code><br>
  · 返回键从页面级绝对定位移进标题栏，和标题同一行<br>
  · 张数从「共 27 张」（#5a5956 太暗）改成「27 张」（#6b6a67 更亮）<br>
  · 瀑布流不再需要 <code>padding-top: 220rpx</code> 硬让位
</div>

</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'album-head-fix.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'album-head-fix.html'));

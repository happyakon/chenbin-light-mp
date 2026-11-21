/**
 * 重新生成预览 —— 这次的布局和真实 WXSS 一致
 *
 * 真实结构：
 *   .nav { display:flex; padding: 16rpx 28rpx 28rpx; gap: 16rpx }
 *     .back  宽 56rpx
 *     .title flex:1
 *     .count 右侧
 *   加上 padding-right: safeRight px
 *
 * 微信胶囊绝对定位在右上角，不参与 flex 布局。
 */
const fs = require('fs');
const path = require('path');

const OUT = 'D:/workspace/chenbin-light/shots';
fs.mkdirSync(OUT, { recursive: true });

/* rpx → px：750rpx = 屏宽 */
function rpx2px(rpx, screenW) {
  return (rpx / 750) * screenW;
}

const DEVICES = [
  { name: 'iPhone 15 Pro', w: 393, capsule: { top: 54, height: 32, width: 87, right: 386 }, sb: 54 },
  { name: 'iPhone SE', w: 375, capsule: { top: 26, height: 32, width: 87, right: 368 }, sb: 20 },
  { name: '小米 14', w: 393, capsule: { top: 48, height: 32, width: 87, right: 386 }, sb: 48 },
];

function calcNav(d) {
  const rightGap = Math.max(d.w - d.capsule.right, 0);
  const safeRight = Math.ceil(d.capsule.width + rightGap + 8);
  /*
   * nav 的内容垂直居中在胶囊的高度上：
   *   padding-top = 胶囊顶部 - 状态栏高度
   * 但这里 nav 是紧贴状态栏下方的，
   * 所以 padding-top 用固定值，nav 高度对齐胶囊即可。
   */
  const navH = d.capsule.height + rpx2px(44, d.w); // 上下各约 22rpx 内边距
  return { safeRight, navH, rightGap };
}

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #141414; padding: 26px;
    font-family: -apple-system, "PingFang SC", sans-serif;
    display: flex; gap: 30px; flex-wrap: wrap; justify-content: center;
    align-items: flex-start;
  }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 9px; }
  .label { font-size: 10.5px; color: #888; text-align: center; line-height: 1.7; }

  .phone {
    background: #0d0d0d; border-radius: 24px; overflow: hidden;
    box-shadow: 0 0 0 2px rgba(255,255,255,.07), 0 12px 32px rgba(0,0,0,.7);
    position: relative;
  }

  .statusbar { background: #0d0d0d; }

  /* 真实 nav：flex + padding */
  .nav { display: flex; align-items: center; }
  .back { color: #c8c6c1; line-height: 1; padding-bottom: 3px; }
  .title {
    flex: 1; font-family: "Songti SC", "SimSun", serif;
    color: #f0efec; letter-spacing: .1em;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .count { color: #5a5956; flex-shrink: 0; }

  /* 微信胶囊 */
  .capsule {
    position: absolute; border-radius: 15px;
    border: 1px solid rgba(255,255,255,.18);
    background: rgba(0,0,0,.42);
    display: flex; align-items: center; justify-content: space-around;
    color: #ddd; z-index: 99;
  }

  .grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 4px; padding: 0 8px 12px;
  }
  .tile { border-radius: 3px; background: linear-gradient(135deg, #26262b, #17171a); }
  .tile:nth-child(3n+1) { aspect-ratio: 3/4; }
  .tile:nth-child(3n+2) { aspect-ratio: 1/1; }
  .tile:nth-child(3n)   { aspect-ratio: 4/5; }
`;

const html = `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><style>${css}</style></head><body>

${DEVICES.map((d) => {
  const nav = calcNav(d);
  const padL = rpx2px(28, d.w);
  const padT = rpx2px(16, d.w);
  const padB = rpx2px(28, d.w);
  const gap = rpx2px(16, d.w);
  const backW = rpx2px(56, d.w);

  return `
<div class="wrap">
  <div class="phone" style="width:${d.w}px;height:620px">
    <div class="statusbar" style="height:${d.sb}px"></div>

    <div class="nav" style="
      padding:${padT}px ${nav.safeRight}px ${padB}px ${padL}px;
      gap:${gap}px;
      height:${nav.navH}px;
    ">
      <div class="back" style="width:${backW}px;font-size:${rpx2px(44, d.w)}px">‹</div>
      <div class="title" style="font-size:${rpx2px(36, d.w)}px">我的收藏</div>
      <div class="count" style="font-size:${rpx2px(22, d.w)}px">28 张</div>
    </div>

    <div class="capsule" style="
      top:${d.capsule.top}px;right:${nav.rightGap}px;
      width:${d.capsule.width}px;height:${d.capsule.height}px;
      font-size:${d.capsule.height * 0.36}px;
    ">
      <span style="letter-spacing:2px">···</span>
      <span style="width:${d.capsule.height - 16}px;height:${d.capsule.height - 16}px;
                   border-radius:50%;border:2px solid #ddd"></span>
    </div>

    <div class="grid">
      ${Array.from({ length: 15 }).map(() => '<div class="tile"></div>').join('')}
    </div>
  </div>
  <div class="label">
    ${d.name} · ${d.w}px<br>
    胶囊占 ${d.capsule.width}px，nav 右留白 ${nav.safeRight}px
  </div>
</div>`;
}).join('')}

</body></html>`;

fs.writeFileSync(path.join(OUT, 'mp-capsule-preview.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'mp-capsule-preview.html'));

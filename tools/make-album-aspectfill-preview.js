/**
 * 相册展开态 · aspectFill 效果预览
 *
 * 严格按用户参考图：
 *   竖图 → 宽度不变，上下被裁
 *   横图 → 高度铺满，左右被裁
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots', 'mp-proto');

// 屏幕尺寸（iPhone 14）
const WIN_W = 390;
const WIN_H = 844;
const STAGE_H = Math.round(WIN_H * 0.52); // 439

function phone({ img, label, type }) {
  return `
  <div class="phone"><div class="screen">
    <div class="status-bar">
      <span>20:55</span>
      <span class="sb-right">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
        <span class="sb-battery"><i></i></span>
      </span>
    </div>

    <!-- 照片区：52% 高度，图片铺满裁切 -->
    <div class="stage">
      <img class="photo" src="${img}" />
    </div>

    <!-- EXIF 面板 -->
    <div class="exif">
      <div class="handle"></div>
      <div class="exif-row"><span>相机</span><b>NIKON CORPORATION NIKON D780</b></div>
      <div class="exif-row"><span>镜头</span><b>VR 24-70mm f/2.8E</b></div>
      <div class="exif-row"><span>光圈</span><b>f/2.8</b></div>
      <div class="exif-row"><span>快门</span><b>1/1250s</b></div>
      <div class="exif-row"><span>ISO</span><b>100</b></div>
      <div class="exif-row"><span>焦距</span><b>48mm</b></div>
      <div class="exif-row"><span>拍摄时间</span><b>2026-10-06 20:27</b></div>
    </div>

    <!-- 底部信息条 -->
    <div class="info-bar">
      <span class="ab">山水之间</span>
      <span class="cnt">5 / 11</span>
      <div class="right">
        <span>♡ <b>0</b></span>
        <span>☆</span>
      </div>
    </div>
  </div></div>`;
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>相册展开态 · aspectFill</title>
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
  .doc-head { max-width: 1100px; margin: 0 auto 40px; }
  .doc-head h1 { font-family: var(--serif); font-weight: 400; font-size: 27px; letter-spacing: 0.14em; color: #f0efec; }
  .doc-head p { margin-top: 12px; font-size: 13px; line-height: 1.9; color: #8a8884; max-width: 820px; }

  .screens { display: flex; gap: 56px; max-width: 1100px; margin: 0 auto; justify-content: center; }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .cap { text-align: center; max-width: 360px; }
  .cap b { display: block; font-size: 13.5px; font-weight: 400; color: #c8c6c1; margin-bottom: 6px; }
  .cap span { font-size: 11.5px; color: #5a5956; line-height: 1.8; }
  .cap .good { color: #7ec99a; }

  .phone {
    width: 390px; height: 844px; background: #000; border-radius: 46px; padding: 10px;
    box-shadow: 0 0 0 1.5px rgba(255,255,255,0.12), 0 22px 60px rgba(0,0,0,0.9);
    position: relative;
  }
  .screen {
    width: 100%; height: 100%; background: #000;
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

  /* 照片区：52% 高度 */
  .stage {
    position: absolute; left: 0; right: 0; top: 0;
    height: 52%;
    overflow: hidden;
    background: #000;
  }

  /*
   * 关键：object-fit: cover
   * 等价于小程序的 mode="aspectFill"
   * 图片铺满区域，超出部分裁掉
   */
  .photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  /* EXIF 面板 */
  .exif {
    position: absolute; left: 0; right: 0;
    top: 52%; bottom: 62px;
    background: #141414;
    border-top: 1px solid rgba(240,239,236,0.09);
    padding: 8px 22px 0;
    overflow: hidden;
  }
  .handle {
    width: 34px; height: 3px; border-radius: 2px;
    background: rgba(240,239,236,0.18);
    margin: 0 auto 14px;
  }
  .exif-row {
    display: flex; align-items: baseline; justify-content: space-between;
    gap: 14px; padding: 11px 0;
    border-bottom: 1px solid rgba(240,239,236,0.045);
  }
  .exif-row:last-child { border-bottom: 0; }
  .exif-row span { font-size: 10px; letter-spacing: 0.14em; color: #5a5956; flex: 0 0 auto; }
  .exif-row b { font-size: 12px; font-weight: 400; color: #c8c6c1; text-align: right; }

  /* 底部信息条 */
  .info-bar {
    position: absolute; left: 0; right: 0; bottom: 0;
    height: 62px;
    display: flex; align-items: center;
    padding: 0 22px;
    background: #0d0d0d;
    border-top: 1px solid rgba(240,239,236,0.07);
    gap: 10px;
  }
  .ab { font-family: var(--serif); font-size: 15px; letter-spacing: 0.1em; color: #f0efec; }
  .cnt { font-size: 11px; color: rgba(255,255,255,0.45); }
  .right { margin-left: auto; display: flex; gap: 16px; font-size: 17px; color: rgba(255,255,255,0.65); }
  .right b { font-size: 12px; font-weight: 400; }

  .note {
    max-width: 1100px; margin: 44px auto 0; padding: 18px 20px;
    border-left: 2px solid var(--gold); background: rgba(201,168,106,0.05);
    font-size: 12.5px; line-height: 2.1; color: #8a8884;
  }
  .note b { color: #c8c6c1; font-weight: 400; }
  .note code { color: var(--gold); font-size: 12px; }
</style>
</head>
<body>

<div class="doc-head">
  <h1>相册展开态 · 铺满裁切</h1>
  <p>按你给的参考图改的：展开后图片铺满整个照片区，超出部分裁掉 —— 就是手机相册那种效果。</p>
</div>

<div class="screens">
  <div class="wrap">
    ${phone({ img: 'kids-0.jpg', label: '竖图', type: 'v' })}
    <div class="cap">
      <b>竖图上滑</b>
      <span class="good">宽度不变，上下被裁<br>和手机相册一样</span>
    </div>
  </div>
  <div class="wrap">
    ${phone({ img: 'scenery-1.jpg', label: '横图', type: 'h' })}
    <div class="cap">
      <b>横图上滑</b>
      <span class="good">高度铺满，左右被裁<br>没有黑边</span>
    </div>
  </div>
</div>

<div class="note">
  <b>这次改的是什么</b><br>
  之前用 <code>aspectFit</code>（完整显示，留黑边）→ 改成 <code>aspectFill</code>（铺满，裁切）<br>
  等价于 CSS 的 <code>object-fit: cover</code><br>
  <br>
  <b>为什么这样对</b><br>
  · <b>竖图</b>：容器 390×439，图片比例 2:3。<code>aspectFill</code> 会按宽度铺满（390 宽），
    高度变成 585px，比容器 439 高 → 上下各裁掉 73px。宽度一点不缩，视觉饱满。<br>
  · <b>横图</b>：容器 390×439，图片比例 3:2。<code>aspectFill</code> 会按高度铺满（439 高），
    宽度变成 658px → 左右各裁掉 134px。也没有黑边。<br>
  <br>
  <b>收起态不变</b><br>
  收起时还是 <code>aspectFit</code>，完整显示照片，两侧（竖图）或上下（横图）留黑边。<br>
  这样刚进相册时能看全图，上滑后变成沉浸式的铺满效果。
</div>

</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'album-aspectfill.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'album-aspectfill.html'));
console.log('屏幕:', WIN_W + '×' + WIN_H, '照片区高:', STAGE_H);

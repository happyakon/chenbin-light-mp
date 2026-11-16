/**
 * 相册展开态 · 黑框修复对比
 *
 * 左边是修复前（两侧黑框），右边是修复后（容器收缩，无黑框）
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots', 'mp-proto');

// 模拟：屏幕 390×844，展开高度 52% = 439px
const WIN_W = 390;
const WIN_H = 844;
const STAGE_H = Math.round(WIN_H * 0.52); // 439

// 照片比例（宽/高）
const VERTICAL = 2 / 3;   // 竖图 600×900
const HORIZONTAL = 3 / 2; // 横图 900×600

function beforeBox(aspect) {
  // 修复前：容器全屏，aspectFit 留黑边
  const fitW = Math.min(WIN_W, STAGE_H * aspect);
  return { stageW: WIN_W, stageH: STAGE_H, imgW: Math.round(fitW), imgH: Math.round(fitW / aspect) };
}

function afterBox(aspect) {
  // 修复后：容器按比例收缩
  let w = STAGE_H * aspect;
  let h = STAGE_H;
  if (w > WIN_W) {
    w = WIN_W;
    h = WIN_W / aspect;
  }
  return { stageW: Math.round(w), stageH: Math.round(h), imgW: Math.round(w), imgH: Math.round(h) };
}

function phone({ aspect, fixed, label }) {
  const box = fixed ? afterBox(aspect) : beforeBox(aspect);
  const photo = aspect > 1 ? 'scenery-1.jpg' : 'kids-0.jpg';

  return `
  <div class="phone"><div class="screen">
    <!-- 状态栏 -->
    <div class="status-bar">
      <span>20:44</span>
      <span class="sb-right">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
        <span class="sb-battery"><i></i></span>
      </span>
    </div>

    <!-- 照片区 -->
    <div class="stage">
      <div class="photo-box" style="width:${box.stageW}px;height:${box.stageH}px">
        <div class="photo" style="width:${box.imgW}px;height:${box.imgH}px;background-image:url('${photo}')"></div>
      </div>
    </div>

    <!-- EXIF 面板 -->
    <div class="exif">
      <div class="handle"></div>
      <div class="exif-row"><span>相机</span><b>NIKON CORPORATION NIKON D780</b></div>
      <div class="exif-row"><span>镜头</span><b>VR 24-70mm f/2.8E</b></div>
      <div class="exif-row"><span>光圈</span><b>f/2.8</b></div>
      <div class="exif-row"><span>快门</span><b>1/100s</b></div>
      <div class="exif-row"><span>ISO</span><b>100</b></div>
      <div class="exif-row"><span>焦距</span><b>62mm</b></div>
      <div class="exif-row"><span>拍摄时间</span><b>2026-10-06 20:27</b></div>
    </div>

    <!-- 底部信息条 -->
    <div class="info-bar">
      <span class="ab">童年纪事</span>
      <span class="cnt">6 / 27</span>
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
<title>相册展开态 · 黑框修复</title>
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
  .doc-head { max-width: 1500px; margin: 0 auto 40px; }
  .doc-head h1 { font-family: var(--serif); font-weight: 400; font-size: 27px; letter-spacing: 0.14em; color: #f0efec; }
  .doc-head p { margin-top: 12px; font-size: 13px; line-height: 1.9; color: #8a8884; max-width: 900px; }

  .screens { display: flex; gap: 36px; max-width: 1500px; margin: 0 auto; flex-wrap: wrap; }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .cap { text-align: center; max-width: 340px; }
  .cap b { display: block; font-size: 13px; font-weight: 400; color: #c8c6c1; margin-bottom: 5px; }
  .cap span { font-size: 11px; color: #5a5956; line-height: 1.7; }
  .cap .bad { color: #d9705f; }
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
    display: flex; align-items: center; justify-content: center;
    background: #000;
  }
  .photo-box {
    position: relative;
    display: flex; align-items: center; justify-content: center;
    /* 宽高由 inline style 给 */
  }
  .photo {
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #000;
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
    max-width: 1500px; margin: 44px auto 0; padding: 18px 20px;
    border-left: 2px solid var(--gold); background: rgba(201,168,106,0.05);
    font-size: 12.5px; line-height: 2.1; color: #8a8884;
  }
  .note b { color: #c8c6c1; font-weight: 400; }
  .note code { color: var(--gold); font-size: 12px; }
</style>
</head>
<body>

<div class="doc-head">
  <h1>相册展开态 · 黑框修复</h1>
  <p>上滑展开后照片区变矮，竖图两侧出现黑框。修复方式：让容器按图片比例收缩，图片正好填满容器。</p>
</div>

<div class="screens">
  <div class="wrap">
    ${phone({ aspect: VERTICAL, fixed: false, label: 'before' })}
    <div class="cap">
      <b>修复前 · 竖图</b>
      <span class="bad">容器 390×439，图片 293×439<br>两侧各 48px 黑框</span>
    </div>
  </div>
  <div class="wrap">
    ${phone({ aspect: VERTICAL, fixed: true, label: 'after' })}
    <div class="cap">
      <b>修复后 · 竖图</b>
      <span class="good">容器收缩为 293×439<br>图片填满，无黑框</span>
    </div>
  </div>
  <div class="wrap">
    ${phone({ aspect: HORIZONTAL, fixed: true, label: 'after-h' })}
    <div class="cap">
      <b>修复后 · 横图</b>
      <span class="good">容器 390×260，宽度受限<br>上下黑边是正常的（横图本来就宽）</span>
    </div>
  </div>
</div>

<div class="note">
  <b>修复原理</b><br>
  让<b>容器本身</b>按图片宽高比收缩，图片用 <code>aspectFit</code> 时正好填满容器 —— 没有多余空间，自然不会出现黑框。<br>
  <br>
  <b>计算方式</b><br>
  · 可用高度 = 屏幕高 × 0.52（如 844 × 0.52 = 439）<br>
  · 容器宽 = 439 × 图片宽高比<br>
  · 若算出的宽 > 屏幕宽 → 说明是横图，改成按屏幕宽算高（容器 390×260）<br>
  <br>
  <b>为什么横图还有上下黑边</b><br>
  横图比例 3:2，屏宽 390 时高度只有 260px，比可用高度 439 矮很多。<br>
  上下留黑边是对的 —— 强行填满会把左右裁掉，那才是灾难。<br>
  <br>
  <b>收起态不变</b><br>
  收起时容器仍占满整屏（<code>style=""></code> 空字符串），保持原有的全屏沉浸观感。
</div>

</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'album-expand-fix.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'album-expand-fix.html'));

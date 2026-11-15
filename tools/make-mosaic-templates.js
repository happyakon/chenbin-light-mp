/**
 * 首页马赛克墙版式原型
 *
 * 4 套固定版式，按轮播图数量自适应。
 * 关键约束：按图片实际比例排，不强行裁成正方形。
 *
 * 输出：shots/mp-proto/mosaic-templates.html
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'shots', 'mp-proto');
const IMG = (n) => `./${n}`;

// 真实素材（按内容分组，模拟一个相册的照片）
const POOL = [
  'scenery-0.jpg', // 竖
  'scenery-1.jpg', // 横
  'scenery-2.jpg', // 竖
  'scenery-3.jpg', // 竖
  'scenery-4.jpg', // 横
  'scenery-5.jpg', // 横
  'kids-0.jpg',    // 竖
  'kids-1.jpg',    // 竖
  'kids-3.jpg',    // 横
];

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

function tabbar() {
  return `
  <div class="tabbar">
    <div class="tab is-active">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 10.5 12 3l9 7.5V21H3z"/></svg>
      <span>首页</span>
    </div>
    <div class="tab">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
      <span>摄影集</span>
    </div>
    <div class="tab">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
      <span>我的</span>
    </div>
    <div class="tab">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v4h1"/></svg>
      <span>关于</span>
    </div>
  </div>`;
}

/* ============================================================
   版式 1：3 张 —— 一大 + 两小
   ┌───────────┬─────┐
   │           │ 小图 │
   │   主图     ├─────┤
   │  （竖）    │ 小图 │
   │           │     │
   └───────────┴─────┘
   ============================================================ */
function layout3() {
  return `
  <div class="page page-index">
    <div class="wall wall-3">
      <div class="cell cell-main" style="background-image:url('${IMG(POOL[0])}')"></div>
      <div class="cell cell-a" style="background-image:url('${IMG(POOL[1])}')"></div>
      <div class="cell cell-b" style="background-image:url('${IMG(POOL[2])}')"></div>
    </div>
    <div class="guide">
      <span class="guide-text">点击屏幕进入摄影集</span>
      <span class="guide-skip">跳过</span>
    </div>
  </div>`;
}

/* ============================================================
   版式 2：4 张 —— 2 × 2，大小交错
   ┌─────────┬───────────┐
   │  竖图    │           │
   │         │  横图占宽  │
   ├─────────┤           │
   │  横图    ├───────────┤
   │         │   竖图     │
   └─────────┴───────────┘
   ============================================================ */
function layout4() {
  return `
  <div class="page page-index">
    <div class="wall wall-4">
      <div class="cell cell-1" style="background-image:url('${IMG(POOL[0])}')"></div>
      <div class="cell cell-2" style="background-image:url('${IMG(POOL[1])}')"></div>
      <div class="cell cell-3" style="background-image:url('${IMG(POOL[4])}')"></div>
      <div class="cell cell-4" style="background-image:url('${IMG(POOL[2])}')"></div>
    </div>
    <div class="guide">
      <span class="guide-text">点击屏幕进入摄影集</span>
      <span class="guide-skip">跳过</span>
    </div>
  </div>`;
}

/* ============================================================
   版式 3：5 张 —— 主图 + 环绕（小图 3 个）
   ┌────────┬─────────────┐
   │        │   小图横      │
   │  主图   ├─────────────┤
   │ （大竖）│   小图横      │
   ├────────┴─────────────┤
   │   小图横（整行）        │
   └──────────────────────┘
   ============================================================ */
function layout5() {
  return `
  <div class="page page-index">
    <div class="wall wall-5">
      <div class="cell c-main" style="background-image:url('${IMG(POOL[0])}')"></div>
      <div class="cell c-1" style="background-image:url('${IMG(POOL[1])}')"></div>
      <div class="cell c-2" style="background-image:url('${IMG(POOL[4])}')"></div>
      <div class="cell c-3" style="background-image:url('${IMG(POOL[5])}')"></div>
      <div class="cell c-big" style="background-image:url('${IMG(POOL[2])}')"></div>
    </div>
    <div class="guide">
      <span class="guide-text">点击屏幕进入摄影集</span>
      <span class="guide-skip">跳过</span>
    </div>
  </div>`;
}

/* ============================================================
   版式 5：8 张 —— 三列不等分
   ┌────┬────┬──────────┐
   │    │    │          │
   │ 小 │ 小 │   大竖    │
   │    │    │          │
   ├────┼────┤          │
   │ 横（跨两列） │          │
   ├────┴────┼──────────┤
   │    小    │   小     │
   ├──────────┼──────────┤
   │  横（整行）           │
   └──────────────────────┘
   ============================================================ */
function layout8() {
  return `
  <div class="page page-index">
    <div class="wall wall-8">
      <div class="cell e-1" style="background-image:url('${IMG(POOL[0])}')"></div>
      <div class="cell e-2" style="background-image:url('${IMG(POOL[6])}')"></div>
      <div class="cell e-3" style="background-image:url('${IMG(POOL[2])}')"></div>
      <div class="cell e-4" style="background-image:url('${IMG(POOL[1])}')"></div>
      <div class="cell e-5" style="background-image:url('${IMG(POOL[3])}')"></div>
      <div class="cell e-6" style="background-image:url('${IMG(POOL[7])}')"></div>
      <div class="cell e-7" style="background-image:url('${IMG(POOL[4])}')"></div>
      <div class="cell e-8" style="background-image:url('${IMG(POOL[8])}')"></div>
    </div>
    <div class="guide">
      <span class="guide-text">点击屏幕进入摄影集</span>
      <span class="guide-skip">跳过</span>
    </div>
  </div>`;
}

/* ============================================================
   版式 3：5-6 张 —— 主图 + 环绕
   ┌──────────────────────┐
   │      横图（整行）      │
   ├────────┬─────────────┤
   │  小竖   │             │
   ├────────┤   主图（大）  │
   │  小竖   │             │
   ├────────┴─────────────┤
   │      横图（整行）      │
   └──────────────────────┘
   ============================================================ */
function layout6() {
  return `
  <div class="page page-index">
    <div class="wall wall-6">
      <div class="cell cell-top" style="background-image:url('${IMG(POOL[1])}')"></div>
      <div class="cell cell-left-1" style="background-image:url('${IMG(POOL[0])}')"></div>
      <div class="cell cell-main" style="background-image:url('${IMG(POOL[2])}')"></div>
      <div class="cell cell-left-2" style="background-image:url('${IMG(POOL[6])}')"></div>
      <div class="cell cell-bottom" style="background-image:url('${IMG(POOL[4])}')"></div>
    </div>
    <div class="guide">
      <span class="guide-text">点击屏幕进入摄影集</span>
      <span class="guide-skip">跳过</span>
    </div>
  </div>`;
}

/* ============================================================
   版式 4：7-9 张 —— 杂志式
   ┌────────┬─────────────┐
   │  竖    │   竖（高）    │
   ├────────┤             │
   │  横    ├─────────────┤
   ├────────┤             │
   │  竖    │   横         │
   ├────────┴─────────────┤
   │      横（整行）        │
   └──────────────────────┘
   ============================================================ */
function layout9() {
  return `
  <div class="page page-index">
    <div class="wall wall-9">
      <div class="cell m-1" style="background-image:url('${IMG(POOL[0])}')"></div>
      <div class="cell m-2" style="background-image:url('${IMG(POOL[2])}')"></div>
      <div class="cell m-3" style="background-image:url('${IMG(POOL[1])}')"></div>
      <div class="cell m-4" style="background-image:url('${IMG(POOL[3])}')"></div>
      <div class="cell m-5" style="background-image:url('${IMG(POOL[6])}')"></div>
      <div class="cell m-6" style="background-image:url('${IMG(POOL[4])}')"></div>
      <div class="cell m-7" style="background-image:url('${IMG(POOL[7])}')"></div>
      <div class="cell m-8" style="background-image:url('${IMG(POOL[8])}')"></div>
      <div class="cell m-9" style="background-image:url('${IMG(POOL[5])}')"></div>
    </div>
    <div class="guide">
      <span class="guide-text">点击屏幕进入摄影集</span>
      <span class="guide-skip">跳过</span>
    </div>
  </div>`;
}

/* ============================================================
   版式 0：0 张 —— 内置默认设计图
   ============================================================ */
function layoutDefault() {
  return `
  <div class="page page-index page-default">
    <div class="default-art">
      <div class="da-circle"></div>
      <div class="da-title">拾 光</div>
      <div class="da-en">CHEN BIN · LIGHT COLLECTION</div>
      <div class="da-line"></div>
    </div>
    <div class="guide">
      <span class="guide-text">点击屏幕进入摄影集</span>
      <span class="guide-skip">跳过</span>
    </div>
  </div>`;
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>首页马赛克墙 · 版式原型</title>
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
  .doc-head { max-width: 1900px; margin: 0 auto 40px; }
  .doc-head h1 { font-family: var(--serif); font-weight: 400; font-size: 27px; letter-spacing: 0.14em; }
  .doc-head p { margin-top: 12px; font-size: 13px; line-height: 1.9; color: var(--muted); max-width: 860px; }

  .screens { display: flex; flex-wrap: wrap; gap: 44px 36px; max-width: 1900px; margin: 0 auto; }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 13px; }
  .cap { text-align: center; max-width: 340px; }
  .cap b { display: block; font-size: 13px; font-weight: 400; color: var(--ink-soft); margin-bottom: 5px; }
  .cap span { font-size: 11px; line-height: 1.7; color: var(--muted-deep); }
  .cap .tag {
    display: inline-block; margin-bottom: 6px; padding: 2px 8px;
    font-size: 9px; letter-spacing: 0.1em; border-radius: 3px;
    background: rgba(201,168,106,0.14); color: var(--gold);
  }

  .phone {
    width: 390px; height: 844px; background: #000; border-radius: 46px; padding: 10px;
    box-shadow: 0 0 0 1.5px rgba(255,255,255,0.12), 0 22px 60px rgba(0,0,0,0.8);
    position: relative;
  }
  .phone-screen {
    width: 100%; height: 100%; background: var(--bg);
    border-radius: 38px; overflow: hidden; position: relative;
  }
  .page { position: absolute; inset: 0; }

  .status-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 48px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 26px 0 32px; font-size: 14px; font-weight: 600; z-index: 40;
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

  .tabbar {
    position: absolute; bottom: 0; left: 0; right: 0; height: 76px;
    background: rgba(13,13,13,0.94); backdrop-filter: blur(20px);
    border-top: 1px solid rgba(240,239,236,0.07);
    display: flex; padding-bottom: 16px; z-index: 30;
  }
  .tab {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 3px;
    color: var(--muted-deep); font-size: 9.5px; letter-spacing: 0.04em;
  }
  .tab.is-active { color: var(--gold); }

  /* ---------------- 通用：墙面 + 引导 ---------------- */
  .page-index { padding: 52px 0 76px; display: flex; flex-direction: column; }
  .wall {
    flex: 1;
    display: grid;
    gap: 8px;
    padding: 10px 12px 0;
    min-height: 0;
  }
  .cell {
    background-size: cover;
    background-position: center;
    border-radius: 3px;
    overflow: hidden;
    box-shadow: 0 3px 16px rgba(0,0,0,0.5);
  }

  .guide {
    flex: 0 0 auto;
    padding: 26px 20px 8px;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    position: relative;
  }
  /* 默认图那屏：引导字浮在底部（tabBar 上方），不占布局高度，让文字真正居中 */
  .page-default .guide {
    position: absolute;
    left: 0; right: 0;
    bottom: 76px;          /* tabBar 高度 */
    padding: 0 20px 26px;
    z-index: 5;
  }
  .page-default .guide-text {
    font-size: 12px;
    letter-spacing: 0.18em;
  }
  .page-default .guide-skip {
    right: 20px; bottom: 26px;
  }
  .guide-text {
    font-size: 13px; letter-spacing: 0.2em; color: var(--ink-soft);
    animation: breathe 2.6s ease-in-out infinite;
  }
  @keyframes breathe {
    0%, 100% { opacity: 0.45; }
    50% { opacity: 1; }
  }
  .guide-skip {
    position: absolute; right: 20px; bottom: 8px;
    font-size: 10.5px; letter-spacing: 0.1em; color: var(--muted-deep);
  }

  /* ---------------- 版式 1：3 张 ---------------- */
  /* 主图占左侧，但高度只占约 70%，下方留白。
     这样格子比例接近竖图 2:3，裁切最少，也不会显得瘦长 */
  .wall-3 {
    grid-template-columns: 1.4fr 1fr;
    grid-template-rows: 0.8fr 0.8fr 0.55fr;
  }
  .wall-3 .cell-main { grid-row: 1 / 3; grid-column: 1; }
  .wall-3 .cell-a { grid-row: 1; grid-column: 2; }
  .wall-3 .cell-b { grid-row: 2 / 4; grid-column: 2; }

  /* ---------------- 版式 2：4 张 ---------------- */
  .wall-4 {
    grid-template-columns: 1fr 1.25fr;
    grid-template-rows: 0.85fr 0.6fr 0.9fr;
  }
  .wall-4 .cell-1 { grid-column: 1; grid-row: 1 / 2; }
  .wall-4 .cell-2 { grid-column: 2; grid-row: 1 / 2; }
  .wall-4 .cell-3 { grid-column: 1; grid-row: 2 / 4; }
  .wall-4 .cell-4 { grid-column: 2; grid-row: 2 / 4; }

  /* ---------------- 版式 3a：5 张 ---------------- */
  .wall-5 {
    grid-template-columns: 1.1fr 1fr;
    grid-template-rows: 1fr 1fr 1.05fr 0.65fr;
  }
  .wall-5 .c-main { grid-column: 1; grid-row: 1 / 4; }
  .wall-5 .c-1 { grid-column: 2; grid-row: 1; }
  .wall-5 .c-2 { grid-column: 2; grid-row: 2; }
  .wall-5 .c-3 { grid-column: 2; grid-row: 3; }
  .wall-5 .c-big { grid-column: 1 / 3; grid-row: 4; }

  /* ---------------- 版式 3c：8 张 ---------------- */
  .wall-8 {
    grid-template-columns: 1fr 1fr 1.35fr;
    grid-template-rows: 1fr 0.8fr 0.95fr 0.72fr;
  }
  .wall-8 .e-1 { grid-column: 1; grid-row: 1; }
  .wall-8 .e-2 { grid-column: 2; grid-row: 1; }
  .wall-8 .e-3 { grid-column: 3; grid-row: 1 / 3; }
  .wall-8 .e-4 { grid-column: 1 / 3; grid-row: 2; }
  .wall-8 .e-5 { grid-column: 1; grid-row: 3; }
  .wall-8 .e-6 { grid-column: 2; grid-row: 3; }
  .wall-8 .e-7 { grid-column: 3; grid-row: 3; }
  .wall-8 .e-8 { grid-column: 1 / 4; grid-row: 4; }

  /* ---------------- 版式 3：5 张 ---------------- */
  .wall-6 {
    grid-template-columns: 1fr 1.5fr;
    grid-template-rows: 0.7fr 1fr 1fr 0.7fr;
  }
  .wall-6 .cell-top { grid-column: 1 / 3; grid-row: 1; }
  .wall-6 .cell-left-1 { grid-column: 1; grid-row: 2; }
  .wall-6 .cell-left-2 { grid-column: 1; grid-row: 3; }
  .wall-6 .cell-main { grid-column: 2; grid-row: 2 / 4; }
  .wall-6 .cell-bottom { grid-column: 1 / 3; grid-row: 4; }

  /* ---------------- 版式 4：9 张 ---------------- */
  .wall-9 {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: repeat(5, 1fr);
  }
  .wall-9 .m-1 { grid-column: 1; grid-row: 1 / 3; }
  .wall-9 .m-2 { grid-column: 2; grid-row: 1 / 3; }
  .wall-9 .m-3 { grid-column: 3; grid-row: 1 / 2; }
  .wall-9 .m-4 { grid-column: 3; grid-row: 2 / 4; }
  .wall-9 .m-5 { grid-column: 1; grid-row: 3 / 5; }
  .wall-9 .m-6 { grid-column: 2; grid-row: 3 / 4; }
  .wall-9 .m-7 { grid-column: 2; grid-row: 4 / 5; }
  .wall-9 .m-8 { grid-column: 1 / 3; grid-row: 5; }
  .wall-9 .m-9 { grid-column: 3; grid-row: 4 / 6; }

  /* ---------------- 默认图 ---------------- */
  /* 全屏铺满内容区（状态栏与 tabBar 之间），文字在可用区域正中 */
  .page-default {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    padding: 52px 0 76px;
    overflow: hidden;
  }
  /* 中心金色微光：覆盖整个内容区，从中心散开 */
  .page-default::before {
    content: '';
    position: absolute;
    left: 50%; top: 46%;
    width: 620px; height: 620px;
    margin-left: -310px; margin-top: -310px;
    background: radial-gradient(
      circle,
      rgba(201,168,106,0.15) 0%,
      rgba(201,168,106,0.06) 30%,
      rgba(201,168,106,0.02) 52%,
      transparent 70%
    );
    pointer-events: none;
  }
  .default-art {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
    position: relative;
    z-index: 2;
  }
  .da-circle {
    position: absolute;
    width: 270px; height: 270px; border-radius: 50%;
    border: 1px solid rgba(201,168,106,0.10);
    box-shadow: inset 0 0 60px rgba(201,168,106,0.035);
  }
  .da-title {
    font-family: var(--serif); font-size: 52px; letter-spacing: 0.4em;
    color: var(--gold); text-indent: 0.4em;
    text-shadow: 0 0 44px rgba(201,168,106,0.34), 0 0 90px rgba(201,168,106,0.14);
    position: relative; z-index: 2;
  }
  .da-en {
    margin-top: 22px;
    font-size: 8.5px; letter-spacing: 0.34em; color: var(--muted-deep);
    text-transform: uppercase;
  }
  .da-line {
    margin-top: 28px; width: 44px; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,106,0.6), transparent);
  }

  .note {
    max-width: 1900px; margin: 46px auto 0; padding: 16px 18px;
    border-left: 2px solid var(--gold); background: rgba(201,168,106,0.05);
    font-size: 12px; line-height: 2; color: var(--muted);
  }
  .note b { color: var(--ink-soft); font-weight: 400; }
</style>
</head>
<body>

<div class="doc-head">
  <h1>首页马赛克墙 · 版式</h1>
  <p>
    4 套固定版式，按轮播图数量自适应。全部用真实照片，按原图比例填充（不强行裁成正方形）。
    图片之间 8px 间隙，整体暗调，无文字块、无装饰线条。
  </p>
</div>

<div class="screens">

  <div class="wrap">
    <div class="phone"><div class="phone-screen">
      ${statusBar()}
      ${layoutDefault()}
      ${tabbar()}
    </div></div>
    <div class="cap">
      <span class="tag">0 张</span>
      <b>内置默认图</b>
      <span>没有轮播图时使用。<br>书法字「拾光」+ 细圆环，不占额外开发。</span>
    </div>
  </div>

  <div class="wrap">
    <div class="phone"><div class="phone-screen">
      ${statusBar()}
      ${layout3()}
      ${tabbar()}
    </div></div>
    <div class="cap">
      <span class="tag">3 张</span>
      <b>一大 + 两小</b>
      <span>主图占左侧 60%，右侧两张叠放。<br>视觉重心明确。</span>
    </div>
  </div>

  <div class="wrap">
    <div class="phone"><div class="phone-screen">
      ${statusBar()}
      ${layout4()}
      ${tabbar()}
    </div></div>
    <div class="cap">
      <span class="tag">4 张</span>
      <b>2 × 2 大小交错</b>
      <span>左列细长、右列方正，形成节奏。<br>不是呆板的等分四格。</span>
    </div>
  </div>

  <div class="wrap">
    <div class="phone"><div class="phone-screen">
      ${statusBar()}
      ${layout5()}
      ${tabbar()}
    </div></div>
    <div class="cap">
      <span class="tag">5 张</span>
      <b>大竖 + 三小 + 横条</b>
      <span>上下压边，中间一张主图。<br>比 6 张版式更疏朗。</span>
    </div>
  </div>

  <div class="wrap">
    <div class="phone"><div class="phone-screen">
      ${statusBar()}
      ${layout8()}
      ${tabbar()}
    </div></div>
    <div class="cap">
      <span class="tag">8 张</span>
      <b>三列不等分</b>
      <span>最小密度里最丰富的一版。<br>为 7-8 张预留。</span>
    </div>
  </div>

  <div class="wrap">
    <div class="phone"><div class="phone-screen">
      ${statusBar()}
      ${layout6()}
      ${tabbar()}
    </div></div>
    <div class="cap">
      <span class="tag">6 张</span>
      <b>主图 + 环绕</b>
      <span>上下各一条横图，中间一张大竖图。<br>层次最丰富。</span>
    </div>
  </div>

  <div class="wrap">
    <div class="phone"><div class="phone-screen">
      ${statusBar()}
      ${layout9()}
      ${tabbar()}
    </div></div>
    <div class="cap">
      <span class="tag">7-9 张</span>
      <b>杂志式多块</b>
      <span>9 格不等分，有大有小。<br>最接近参考图的拼贴感。</span>
    </div>
  </div>

</div>

<div class="note">
  <b>设计要点</b><br>
  · 图片按 <code>cover</code> 填充，但格子宽高比接近原图，所以裁切很少<br>
  · 间隙统一 8px，不紧贴，留出呼吸感<br>
  · 圆角极小（3px），保持利落，不做圆润卡片<br>
  · 引导文字有呼吸动画，右下角「跳过」常驻<br>
  · 全部无文字块、无手绘线条 —— 纯图片拼接
</div>

</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'mosaic-templates.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'mosaic-templates.html'));

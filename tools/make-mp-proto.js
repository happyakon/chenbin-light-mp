/**
 * 小程序原型图生成器
 *
 * 按 iPhone 14 尺寸（390×844）渲染真实视觉稿，
 * 用项目里的真实照片做素材。
 *
 * 输出：shots/mp-proto/index.html（可浏览器打开），以及截图
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'shots', 'mp-proto');
const IMG = (n) => `./${n}`;

// 相册数据（模拟真实数据）
const ALBUMS = [
  { key: 'scenery', title: '山水之间', en: 'Between Mountains', count: 19, cover: 'scenery-0.jpg' },
  { key: 'luoyang', title: '神都洛阳', en: 'Luoyang', count: 16, cover: 'scenery-2.jpg' },
  { key: 'kids', title: '童年纪事', en: 'Childhood Days', count: 29, cover: 'kids-0.jpg' },
  { key: 'full', title: '兜兜满月了', en: 'One Month', count: 4, cover: 'kids-3.jpg', locked: true },
  { key: 'people', title: '人物光影', en: 'Portraits', count: 28, cover: 'people-0.jpg' },
];

const SCENERY = ['scenery-0.jpg', 'scenery-1.jpg', 'scenery-2.jpg', 'scenery-3.jpg', 'scenery-4.jpg', 'scenery-5.jpg'];

/* ------------------------------------------------------------ 页面片段 */

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

/* ---------- 页面 1：首页相册网格 ---------- */
function pageIndex() {
  const cards = ALBUMS.map(
    (a) => `
    <div class="album-card">
      <div class="ac-cover" style="background-image:url('${IMG(a.cover)}')">
        ${a.locked ? '<span class="ac-lock">🔒</span>' : ''}
        <div class="ac-shade"></div>
        <div class="ac-text">
          <span class="ac-cn">${a.title}</span>
          <span class="ac-en">${a.en}</span>
        </div>
      </div>
      <div class="ac-count">${a.count} 张</div>
    </div>`
  ).join('');

  return `
  <div class="phone">
    <div class="phone-screen">
      ${statusBar()}
      <div class="page page-index">
        <div class="idx-head">
          <h1>陈彬拾光集</h1>
          <p>CHEN BIN · LIGHT COLLECTION</p>
        </div>
        <div class="idx-scroll">
          <div class="idx-grid">${cards}</div>
          <div class="idx-fade"></div>
        </div>
      </div>
      <div class="tabbar">
        <div class="tab is-active">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          <span>摄影集</span>
        </div>
        <div class="tab">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
          <span>我的</span>
        </div>
      </div>
      <div class="home-indicator"></div>
    </div>
  </div>`;
}

/* ---------- 页面 2：相册浏览（收起） ---------- */
function pageAlbumCollapsed() {
  return `
  <div class="phone">
    <div class="phone-screen">
      ${statusBar()}
      <div class="page page-album">
        <div class="ab-top">
          <span class="ab-back">‹</span>
        </div>
        <div class="ab-photo" style="background-image:url('${IMG(SCENERY[0])}')"></div>
        <div class="ab-info">
          <div class="ab-line1">
            <span class="ab-album">山水之间</span>
            <span class="ab-count">1 / 19</span>
          </div>
          <div class="ab-line2">
            <span class="ab-like">♡ <b>12</b></span>
            <span class="ab-fav">☆</span>
          </div>
        </div>
        <div class="ab-hint">
          <span class="hint-arrow">⌃</span>
          <span>上滑看参数</span>
        </div>
      </div>
      <div class="home-indicator"></div>
    </div>
  </div>`;
}

/* ---------- 页面 3：相册浏览（上滑展开 EXIF） ---------- */
function pageAlbumExpanded() {
  const exif = [
    ['相机', 'NIKON CORPORATION NIKON D850'],
    ['镜头', '70.0-200.0 mm f/2.8'],
    ['光圈', 'f/8'],
    ['快门', '1/80s'],
    ['ISO', '250'],
    ['焦距', '70mm'],
    ['拍摄时间', '2026-11-02 16:44'],
  ]
    .map(
      ([k, v]) => `
      <div class="exif-row${k === '相机' || k === '镜头' ? ' is-wide' : ''}">
        <span class="ek">${k}</span>
        <span class="ev">${v}</span>
      </div>`
    )
    .join('');

  return `
  <div class="phone">
    <div class="phone-screen">
      ${statusBar()}
      <div class="page page-album is-expanded">
        <div class="ab-top">
          <span class="ab-back">‹</span>
        </div>
        <div class="ab-photo is-small" style="background-image:url('${IMG(SCENERY[0])}')"></div>
        <div class="exif-panel">
          <div class="exif-drag"></div>
          <div class="exif-list">${exif}</div>
        </div>
        <div class="ab-info is-bottom">
          <div class="ab-line1">
            <span class="ab-album">山水之间</span>
            <span class="ab-count">1 / 19</span>
          </div>
          <span class="ab-like">♡ <b>12</b></span>
        </div>
      </div>
      <div class="home-indicator"></div>
    </div>
  </div>`;
}

/* ---------- 页面 4：相册解锁 ---------- */
function pageUnlock() {
  return `
  <div class="phone">
    <div class="phone-screen">
      ${statusBar()}
      <div class="page page-unlock">
        <div class="ul-content">
          <div class="ul-lock">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#c9a86a" stroke-width="1.5">
              <rect x="4" y="10" width="16" height="11" rx="2"/>
              <path d="M8 10V7a4 4 0 0 1 8 0v3"/>
            </svg>
          </div>
          <h2 class="ul-title">兜兜满月了</h2>
          <p class="ul-hint">请输入密码后查看</p>
          <div class="ul-input">
            <span class="dots">••••••••</span>
          </div>
          <button class="ul-btn">进入</button>
          <p class="ul-warn">连续错误 5 次将锁定 4 小时</p>
        </div>
      </div>
      <div class="home-indicator"></div>
    </div>
  </div>`;
}

/* ---------- 页面 5：我的 ---------- */
function pageMine() {
  return `
  <div class="phone">
    <div class="phone-screen">
      ${statusBar()}
      <div class="page page-mine">
        <div class="me-profile">
          <div class="me-avatar">👤</div>
          <div class="me-info">
            <span class="me-name">微信用户</span>
            <span class="me-set">设置头像昵称 ›</span>
          </div>
        </div>
        <div class="me-list">
          <div class="me-item">
            <span class="mi-icon">☆</span>
            <span class="mi-label">我的收藏</span>
            <span class="mi-value">12 张</span>
            <span class="mi-arrow">›</span>
          </div>
          <div class="me-item">
            <span class="mi-icon">ⓘ</span>
            <span class="mi-label">关于</span>
            <span class="mi-value">v1.0.0</span>
            <span class="mi-arrow">›</span>
          </div>
        </div>
      </div>
      <div class="tabbar">
        <div class="tab">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          <span>摄影集</span>
        </div>
        <div class="tab is-active">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
          <span>我的</span>
        </div>
      </div>
      <div class="home-indicator"></div>
    </div>
  </div>`;
}

/* ---------- 页面 6：收藏列表 ---------- */
function pageFavorites() {
  const items = ['scenery-1.jpg', 'kids-1.jpg', 'people-1.jpg', 'scenery-3.jpg', 'kids-4.jpg', 'people-3.jpg']
    .map((f) => `<div class="fav-item" style="background-image:url('${IMG(f)}')"></div>`)
    .join('');

  return `
  <div class="phone">
    <div class="phone-screen">
      ${statusBar()}
      <div class="page page-fav">
        <div class="fav-head">
          <span class="fav-back">‹</span>
          <h2>我的收藏</h2>
          <span class="fav-num">12 张</span>
        </div>
        <div class="fav-grid">${items}</div>
      </div>
      <div class="home-indicator"></div>
    </div>
  </div>`;
}

/* ------------------------------------------------------------ 页面整体 */

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>微信小程序原型图 · 陈彬拾光集</title>
<style>
  :root {
    --bg: #0d0d0d;
    --panel: #141414;
    --line: rgba(240,239,236,0.10);
    --ink: #f0efec;
    --ink-soft: #c8c6c1;
    --muted: #8a8884;
    --muted-deep: #5a5956;
    --gold: #c9a86a;
    --serif: "Songti SC","SimSun","Noto Serif CJK SC",Georgia,serif;
    --sans: -apple-system, "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0a0a0a;
    color: var(--ink);
    font-family: var(--sans);
    padding: 48px 40px 80px;
    -webkit-font-smoothing: antialiased;
  }

  .doc-head { max-width: 1600px; margin: 0 auto 48px; }
  .doc-head h1 {
    font-family: var(--serif); font-weight: 400; font-size: 30px;
    letter-spacing: 0.14em;
  }
  .doc-head .en {
    display: block; margin-top: 8px;
    font-size: 10px; letter-spacing: 0.34em; color: var(--muted);
    text-transform: uppercase;
  }
  .doc-head p {
    margin-top: 20px; font-size: 13px; line-height: 1.9;
    color: var(--muted); letter-spacing: 0.03em; max-width: 760px;
  }

  .screens {
    display: flex; flex-wrap: wrap; gap: 56px 48px;
    max-width: 1600px; margin: 0 auto;
    justify-content: flex-start;
  }
  .screen-wrap { display: flex; flex-direction: column; align-items: center; gap: 18px; }
  .screen-cap {
    text-align: center;
  }
  .screen-cap b {
    display: block; font-size: 13px; font-weight: 400;
    letter-spacing: 0.1em; color: var(--ink-soft);
  }
  .screen-cap span {
    display: block; margin-top: 5px; font-size: 11px;
    color: var(--muted-deep); letter-spacing: 0.04em;
  }

  /* ---------------------------------------------------- 手机外壳 */
  .phone {
    width: 390px; height: 844px;
    background: #000;
    border-radius: 46px;
    padding: 10px;
    box-shadow:
      0 0 0 1.5px rgba(255,255,255,0.12),
      0 24px 70px rgba(0,0,0,0.85),
      0 0 120px rgba(201,168,106,0.05);
    position: relative;
  }
  .phone-screen {
    width: 100%; height: 100%;
    background: var(--bg);
    border-radius: 38px;
    overflow: hidden;
    position: relative;
  }

  /* 状态栏 */
  .status-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 48px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 26px 0 32px;
    font-size: 14px; font-weight: 600; color: var(--ink);
    z-index: 30;
  }
  .sb-right { display: flex; align-items: center; gap: 6px; }
  .sb-battery {
    width: 24px; height: 11px; border: 1px solid rgba(240,239,236,0.5);
    border-radius: 3px; padding: 1.5px; display: block; position: relative;
  }
  .sb-battery::after {
    content: ''; position: absolute; right: -3px; top: 3px;
    width: 1.5px; height: 5px; background: rgba(240,239,236,0.5);
    border-radius: 0 1px 1px 0;
  }
  .sb-battery i { display: block; width: 75%; height: 100%; background: var(--ink); border-radius: 1px; }

  .home-indicator {
    position: absolute; bottom: 9px; left: 50%; transform: translateX(-50%);
    width: 134px; height: 5px; border-radius: 3px;
    background: rgba(240,239,236,0.6); z-index: 30;
  }

  .page { position: absolute; inset: 0; }

  /* ---------------------------------------------------- TabBar */
  .tabbar {
    position: absolute; bottom: 0; left: 0; right: 0; height: 76px;
    background: rgba(13,13,13,0.94);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(240,239,236,0.07);
    display: flex; padding-bottom: 18px; z-index: 20;
  }
  .tab {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 3px;
    color: var(--muted-deep); font-size: 10px; letter-spacing: 0.05em;
  }
  .tab.is-active { color: var(--gold); }

  /* ---------------------------------------------------- 1. 首页 */
  .page-index { padding: 56px 0 0; overflow: hidden; }
  .idx-head { padding: 8px 22px 18px; }
  .idx-head h1 {
    font-family: var(--serif); font-weight: 400; font-size: 23px;
    letter-spacing: 0.16em; color: var(--ink);
  }
  .idx-head p {
    margin-top: 6px; font-size: 8px; letter-spacing: 0.3em;
    color: var(--muted-deep); text-transform: uppercase;
  }
  .idx-scroll {
    height: calc(100% - 96px);
    overflow: hidden;
    position: relative;
  }
  .idx-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 12px; padding: 0 16px calc(76px + 20px);
  }
  /* 底部渐隐，暗示还有内容可滚动 */
  .idx-fade {
    position: absolute; left: 0; right: 0; bottom: 76px; height: 110px;
    background: linear-gradient(to top, rgba(13,13,13,1) 10%, rgba(13,13,13,0));
    pointer-events: none; z-index: 15;
  }
  .album-card { position: relative; }
  .ac-cover {
    width: 100%; aspect-ratio: 3 / 4;
    border-radius: 6px; overflow: hidden;
    background-size: cover; background-position: center;
    position: relative;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  }
  .ac-shade {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0) 70%);
  }
  .ac-lock {
    position: absolute; top: 9px; right: 9px; z-index: 2;
    width: 24px; height: 24px; border-radius: 50%;
    background: rgba(0,0,0,0.55); backdrop-filter: blur(6px);
    display: grid; place-items: center; font-size: 11px;
  }
  .ac-text {
    position: absolute; left: 12px; right: 12px; bottom: 12px; z-index: 2;
    display: flex; flex-direction: column; gap: 3px;
  }
  .ac-cn {
    font-family: var(--serif); font-size: 16px; letter-spacing: 0.1em;
    color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.8);
  }
  .ac-en {
    font-size: 8.5px; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(255,255,255,0.55);
  }
  .ac-count {
    margin-top: 7px; font-size: 11px; color: var(--muted-deep);
    letter-spacing: 0.06em;
  }

  /* ---------------------------------------------------- 2/3. 相册浏览 */
  .page-album { background: #000; overflow: hidden; }
  .ab-top {
    position: absolute; top: 48px; left: 0; right: 0; height: 44px;
    display: flex; align-items: center; padding: 0 16px; z-index: 25;
  }
  .ab-back {
    width: 34px; height: 34px; border-radius: 50%;
    background: rgba(0,0,0,0.4); backdrop-filter: blur(8px);
    display: grid; place-items: center;
    font-size: 22px; color: var(--ink-soft); line-height: 1;
    padding-bottom: 3px;
  }
  .ab-photo {
    position: absolute; inset: 0;
    background-size: contain; background-position: center; background-repeat: no-repeat;
    background-color: #000;
  }
  /* 展开态：照片缩到上半部分，给 EXIF 面板让位 */
  .ab-photo.is-small {
    top: 78px;
    bottom: 44%;
    background-size: contain;
    background-position: center;
    background-color: #000;
  }
  .ab-info {
    position: absolute; left: 0; right: 0; bottom: 0;
    padding: 18px 22px 40px; z-index: 20;
    background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0));
  }
  .ab-line1 {
    display: flex; align-items: baseline; justify-content: space-between;
  }
  .ab-album {
    font-family: var(--serif); font-size: 16px; letter-spacing: 0.1em; color: var(--ink);
  }
  .ab-count {
    font-size: 12px; letter-spacing: 0.08em; color: rgba(255,255,255,0.5);
  }
  .ab-line2 {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 12px;
  }
  .ab-like {
    font-size: 15px; color: rgba(255,255,255,0.75); letter-spacing: 0.04em;
  }
  .ab-like b { font-weight: 400; font-size: 13px; margin-left: 2px; }
  .ab-fav { font-size: 18px; color: rgba(255,255,255,0.6); }

  .ab-hint {
    position: absolute; left: 0; right: 0; bottom: 116px;
    display: flex; flex-direction: column; align-items: center; gap: 5px;
    font-size: 10.5px; letter-spacing: 0.16em;
    color: rgba(255,255,255,0.32); z-index: 21;
    animation: hintFloat 2.4s ease-in-out infinite;
  }
  .hint-arrow { font-size: 13px; }
  @keyframes hintFloat {
    0%, 100% { transform: translateY(0); opacity: .5; }
    50% { transform: translateY(-6px); opacity: .95; }
  }

  /* 展开态 */
  .exif-panel {
    position: absolute; left: 0; right: 0; bottom: 76px;
    height: 42%;
    background: rgba(13,13,13,0.98);
    backdrop-filter: blur(22px);
    border-top: 1px solid rgba(240,239,236,0.09);
    border-radius: 14px 14px 0 0;
    z-index: 18;
    padding: 9px 24px 0;
    display: flex; flex-direction: column;
  }
  .exif-drag {
    width: 34px; height: 3px; border-radius: 2px;
    background: rgba(240,239,236,0.18);
    margin: 0 auto 10px;
  }
  .exif-list { flex: 1; overflow: hidden; display: flex; flex-direction: column; justify-content: space-evenly; }
  .exif-row {
    display: flex; align-items: baseline; gap: 16px;
    padding: 4px 0;
  }
  .ek {
    flex: 0 0 auto; width: 60px;
    font-size: 9.5px; letter-spacing: 0.14em; color: var(--muted-deep);
  }
  .ev {
    flex: 1; text-align: right;
    font-size: 11.5px; letter-spacing: 0.02em; color: var(--ink-soft);
    line-height: 1.45;
  }
  .ab-info.is-bottom {
    position: absolute; left: 0; right: 0; bottom: 0; height: 76px;
    background: rgba(13,13,13,0.98);
    backdrop-filter: blur(22px);
    padding: 10px 24px 22px; z-index: 20;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ab-info.is-bottom .ab-line1 { gap: 12px; }
  .ab-info.is-bottom .ab-album { font-size: 12.5px; color: var(--ink-soft); }
  .ab-info.is-bottom .ab-count { font-size: 10.5px; }
  .ab-info.is-bottom .ab-like { font-size: 13px; margin: 0; }

  /* ---------------------------------------------------- 4. 解锁 */
  .page-unlock { display: flex; align-items: center; justify-content: center; }
  .ul-content {
    display: flex; flex-direction: column; align-items: center;
    padding: 0 44px; width: 100%; margin-top: -40px;
  }
  .ul-lock { margin-bottom: 26px; opacity: 0.9; }
  .ul-title {
    font-family: var(--serif); font-weight: 400; font-size: 25px;
    letter-spacing: 0.14em; color: var(--ink);
  }
  .ul-hint {
    margin-top: 10px; font-size: 12.5px; letter-spacing: 0.06em;
    color: var(--muted);
  }
  .ul-input {
    width: 100%; margin-top: 40px; height: 52px;
    border: 1px solid rgba(240,239,236,0.14);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.02);
  }
  .dots { font-size: 20px; letter-spacing: 0.32em; color: var(--ink-soft); }
  .ul-btn {
    width: 100%; margin-top: 16px; height: 52px;
    border: 1px solid var(--gold);
    border-radius: 8px; background: rgba(201,168,106,0.10);
    color: var(--gold); font-size: 15px; letter-spacing: 0.3em;
    font-family: inherit; cursor: pointer;
  }
  .ul-warn {
    margin-top: 26px; font-size: 11px; letter-spacing: 0.06em;
    color: var(--muted-deep); text-align: center;
  }

  /* ---------------------------------------------------- 5. 我的 */
  .page-mine { padding: 76px 0 0; }
  .me-profile {
    display: flex; align-items: center; gap: 16px;
    padding: 16px 24px 30px;
  }
  .me-avatar {
    width: 62px; height: 62px; border-radius: 50%;
    background: #1e1e1e; border: 1px solid rgba(240,239,236,0.1);
    display: grid; place-items: center; font-size: 26px;
    filter: grayscale(1) opacity(.45);
  }
  .me-info { display: flex; flex-direction: column; gap: 6px; }
  .me-name {
    font-family: var(--serif); font-size: 19px;
    letter-spacing: 0.08em; color: var(--ink);
  }
  .me-set { font-size: 11.5px; letter-spacing: 0.04em; color: var(--gold); }

  .me-list { border-top: 1px solid rgba(240,239,236,0.07); }
  .me-item {
    display: flex; align-items: center; gap: 14px;
    padding: 18px 24px;
    border-bottom: 1px solid rgba(240,239,236,0.055);
  }
  .mi-icon { font-size: 15px; color: var(--muted); width: 18px; text-align: center; }
  .mi-label { flex: 1; font-size: 14px; color: var(--ink-soft); letter-spacing: 0.04em; }
  .mi-value { font-size: 12px; color: var(--muted-deep); }
  .mi-arrow { font-size: 16px; color: var(--muted-deep); }

  /* ---------------------------------------------------- 6. 收藏 */
  .page-fav { padding: 60px 0 0; }
  .fav-head {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 20px 20px;
  }
  .fav-back {
    font-size: 24px; color: var(--ink-soft); line-height: 1;
    padding-bottom: 3px;
  }
  .fav-head h2 {
    flex: 1; font-family: var(--serif); font-weight: 400;
    font-size: 18px; letter-spacing: 0.1em; color: var(--ink);
  }
  .fav-num { font-size: 11.5px; color: var(--muted-deep); }
  .fav-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
    padding: 0 16px;
  }
  .fav-item {
    width: 100%; aspect-ratio: 1;
    border-radius: 5px;
    background-size: cover; background-position: center;
    box-shadow: 0 3px 14px rgba(0,0,0,0.45);
  }
</style>
</head>
<body>

<div class="doc-head">
  <h1>陈彬拾光集 · 小程序原型</h1>
  <span class="en">WeChat Mini Program · Visual Prototype</span>
  <p>
    按 iPhone 14（390 × 844）尺寸渲染，用项目真实照片作素材。
    暗调画廊风，与 Web 端保持同一套设计语言。
  </p>
</div>

<div class="screens">

  <div class="screen-wrap">
    ${pageIndex()}
    <div class="screen-cap">
      <b>首页 · 相册网格</b>
      <span>2 列，封面 3:4 裁切，加锁相册右上角有锁标记</span>
    </div>
  </div>

  <div class="screen-wrap">
    ${pageAlbumCollapsed()}
    <div class="screen-cap">
      <b>相册浏览 · 收起</b>
      <span>全屏照片，底部信息条，上滑看参数</span>
    </div>
  </div>

  <div class="screen-wrap">
    ${pageAlbumExpanded()}
    <div class="screen-cap">
      <b>相册浏览 · 上滑展开</b>
      <span>EXIF 面板跟手滑出，照片上移缩小</span>
    </div>
  </div>

  <div class="screen-wrap">
    ${pageUnlock()}
    <div class="screen-cap">
      <b>相册解锁</b>
      <span>密码输入，连续错误 5 次锁定 4 小时</span>
    </div>
  </div>

  <div class="screen-wrap">
    ${pageMine()}
    <div class="screen-cap">
      <b>我的</b>
      <span>未设资料时显示「微信用户」+ 设置入口</span>
    </div>
  </div>

  <div class="screen-wrap">
    ${pageFavorites()}
    <div class="screen-cap">
      <b>我的收藏</b>
      <span>2 列方格，点进去定位到那张照片</span>
    </div>
  </div>

</div>

</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'index.html'));
console.log('页面数: 6');

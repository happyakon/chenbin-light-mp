/**
 * 授权流程原型
 *
 * 展示弹窗引导授权的完整流程，让用户判断体验好坏：
 *   1. 首次进入的弹窗
 *   2. 授权页（头像 + 昵称分开操作）
 *   3. 授权完成后的「我的」
 *   4. 对照：不做授权的「我的」
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'shots', 'mp-proto');
const IMG = (n) => `./${n}`;

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

function tabbar(active) {
  return `
  <div class="tabbar">
    <div class="tab${active === 'index' ? ' is-active' : ''}">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
      <span>摄影集</span>
    </div>
    <div class="tab${active === 'mine' ? ' is-active' : ''}">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
      <span>我的</span>
    </div>
  </div>`;
}

/* ---------- 1. 首次进入的弹窗 ---------- */
function screenDialog() {
  return `
  <div class="phone">
    <div class="phone-screen">
      ${statusBar()}
      <!-- 背景：首页被遮罩 -->
      <div class="page bg-dim">
        <div class="idx-head"><h1>陈彬拾光集</h1><p>CHEN BIN · LIGHT COLLECTION</p></div>
        <div class="mini-grid">
          ${['scenery-0.jpg','scenery-2.jpg','kids-0.jpg','kids-3.jpg'].map(f =>
            `<div class="mini-cover" style="background-image:url('${IMG(f)}')"></div>`
          ).join('')}
        </div>
      </div>

      <!-- 弹窗 -->
      <div class="dialog-mask"></div>
      <div class="dialog">
        <div class="dlg-title">完善资料</div>
        <div class="dlg-body">
          设置头像和昵称，<br>你赞过的照片会显示头像
        </div>
        <div class="dlg-btn-primary">去设置</div>
        <div class="dlg-btn-text">以后再说</div>
      </div>

      <div class="home-indicator"></div>
    </div>
  </div>`;
}

/* ---------- 2. 授权页 ---------- */
function screenProfile() {
  return `
  <div class="phone">
    <div class="phone-screen">
      ${statusBar()}
      <div class="page page-profile">
        <div class="pf-nav">
          <span class="pf-back">‹</span>
          <span class="pf-title">完善资料</span>
          <span class="pf-skip">跳过</span>
        </div>

        <div class="pf-avatar-area">
          <button class="pf-avatar-btn">
            <div class="pf-avatar">👤</div>
            <span class="pf-avatar-hint">点击选择头像</span>
          </button>
        </div>

        <div class="pf-field">
          <label>昵称</label>
          <input class="pf-input" value="微信用户" readonly />
          <span class="pf-field-hint">点击输入框，会弹出微信昵称</span>
        </div>

        <div class="pf-note">
          头像和昵称需要分别设置<br>
          微信不支持一次性获取
        </div>

        <button class="pf-save">保存</button>
      </div>
      <div class="home-indicator"></div>
    </div>
  </div>`;
}

/* ---------- 3. 授权后的「我的」 ---------- */
function screenMineAfter() {
  return `
  <div class="phone">
    <div class="phone-screen">
      ${statusBar()}
      <div class="page page-mine">
        <div class="me-profile">
          <div class="me-avatar is-set" style="background-image:url('${IMG('people-0.jpg')}')"></div>
          <div class="me-info">
            <span class="me-name">拾光的人</span>
            <span class="me-sub">已完善资料</span>
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
            <span class="mi-icon">♡</span>
            <span class="mi-label">我赞过的</span>
            <span class="mi-value">8 张</span>
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
      ${tabbar('mine')}
      <div class="home-indicator"></div>
    </div>
  </div>`;
}

/* ---------- 4. 对照：不做授权的「我的」 ---------- */
function screenMineSimple() {
  return `
  <div class="phone">
    <div class="phone-screen">
      ${statusBar()}
      <div class="page page-mine">
        <div class="me-list is-top">
          <div class="me-item">
            <span class="mi-icon">☆</span>
            <span class="mi-label">我的收藏</span>
            <span class="mi-value">12 张</span>
            <span class="mi-arrow">›</span>
          </div>
          <div class="me-item">
            <span class="mi-icon">♡</span>
            <span class="mi-label">我赞过的</span>
            <span class="mi-value">8 张</span>
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
      ${tabbar('mine')}
      <div class="home-indicator"></div>
    </div>
  </div>`;
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>授权流程原型</title>
<style>
  :root {
    --bg: #0d0d0d; --panel: #141414;
    --ink: #f0efec; --ink-soft: #c8c6c1;
    --muted: #8a8884; --muted-deep: #5a5956; --gold: #c9a86a;
    --serif: "Songti SC","SimSun",Georgia,serif;
    --sans: -apple-system, "PingFang SC", "Helvetica Neue", sans-serif;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #0a0a0a; color: var(--ink); font-family: var(--sans);
    padding: 48px 40px 80px; -webkit-font-smoothing: antialiased;
  }
  .doc-head { max-width: 1700px; margin: 0 auto 44px; }
  .doc-head h1 { font-family: var(--serif); font-weight: 400; font-size: 28px; letter-spacing: 0.14em; }
  .doc-head p { margin-top: 14px; font-size: 13px; line-height: 1.9; color: var(--muted); max-width: 820px; }

  .screens { display: flex; flex-wrap: wrap; gap: 48px 40px; max-width: 1700px; margin: 0 auto; }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .cap { text-align: center; max-width: 380px; }
  .cap b { display: block; font-size: 13.5px; font-weight: 400; color: var(--ink-soft); margin-bottom: 6px; }
  .cap span { font-size: 11.5px; line-height: 1.8; color: var(--muted-deep); }
  .cap .tag {
    display: inline-block; margin-bottom: 7px; padding: 3px 9px;
    font-size: 9.5px; letter-spacing: 0.1em; border-radius: 3px;
  }
  .tag-warn { background: rgba(200,120,80,0.16); color: #d99a6c; }
  .tag-ok { background: rgba(201,168,106,0.16); color: var(--gold); }
  .tag-num { background: rgba(240,239,236,0.08); color: var(--muted); }

  .phone {
    width: 390px; height: 844px; background: #000; border-radius: 46px; padding: 10px;
    box-shadow: 0 0 0 1.5px rgba(255,255,255,0.12), 0 24px 70px rgba(0,0,0,0.85);
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
  .home-indicator {
    position: absolute; bottom: 9px; left: 50%; transform: translateX(-50%);
    width: 134px; height: 5px; border-radius: 3px;
    background: rgba(240,239,236,0.6); z-index: 40;
  }

  .tabbar {
    position: absolute; bottom: 0; left: 0; right: 0; height: 76px;
    background: rgba(13,13,13,0.94); backdrop-filter: blur(20px);
    border-top: 1px solid rgba(240,239,236,0.07);
    display: flex; padding-bottom: 18px; z-index: 20;
  }
  .tab {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 3px;
    color: var(--muted-deep); font-size: 10px;
  }
  .tab.is-active { color: var(--gold); }

  /* ---------- 1. 弹窗 ---------- */
  .bg-dim { filter: brightness(0.35) blur(1px); }
  .idx-head { padding: 62px 22px 18px; }
  .idx-head h1 { font-family: var(--serif); font-weight: 400; font-size: 23px; letter-spacing: 0.16em; }
  .idx-head p { margin-top: 6px; font-size: 8px; letter-spacing: 0.3em; color: var(--muted-deep); }
  .mini-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 16px; }
  .mini-cover {
    aspect-ratio: 3/4; border-radius: 6px;
    background-size: cover; background-position: center;
  }
  .dialog-mask {
    position: absolute; inset: 0; background: rgba(0,0,0,0.65); z-index: 30;
  }
  .dialog {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
    width: 300px; background: #1a1a1a; border-radius: 14px;
    padding: 26px 22px 16px; z-index: 35;
    box-shadow: 0 20px 60px rgba(0,0,0,0.8);
    display: flex; flex-direction: column; align-items: center;
  }
  .dlg-title {
    font-family: var(--serif); font-size: 17px; letter-spacing: 0.08em;
    color: var(--ink); margin-bottom: 12px;
  }
  .dlg-body {
    font-size: 12.5px; line-height: 1.8; color: var(--muted);
    text-align: center; margin-bottom: 22px;
  }
  .dlg-btn-primary {
    width: 100%; height: 42px; border-radius: 8px;
    background: rgba(201,168,106,0.14); border: 1px solid var(--gold);
    color: var(--gold); font-size: 14px; letter-spacing: 0.16em;
    display: grid; place-items: center;
  }
  .dlg-btn-text {
    margin-top: 14px; padding: 8px;
    font-size: 12.5px; color: var(--muted-deep); letter-spacing: 0.06em;
  }

  /* ---------- 2. 授权页 ---------- */
  .page-profile { padding: 60px 0 0; }
  .pf-nav {
    display: flex; align-items: center; padding: 8px 20px 24px;
  }
  .pf-back { font-size: 24px; color: var(--ink-soft); width: 40px; }
  .pf-title {
    flex: 1; text-align: center; font-family: var(--serif);
    font-size: 16px; letter-spacing: 0.1em; color: var(--ink);
  }
  .pf-skip { font-size: 13px; color: var(--muted-deep); width: 40px; text-align: right; }

  .pf-avatar-area { display: flex; justify-content: center; padding: 20px 0 32px; }
  .pf-avatar-btn {
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    background: none; border: 0; cursor: pointer;
  }
  .pf-avatar {
    width: 88px; height: 88px; border-radius: 50%;
    background: #1e1e1e; border: 1px dashed rgba(240,239,236,0.2);
    display: grid; place-items: center; font-size: 34px;
    filter: grayscale(1) opacity(.4);
  }
  .pf-avatar-hint { font-size: 11.5px; color: var(--gold); letter-spacing: 0.05em; }

  .pf-field { padding: 0 28px; }
  .pf-field label {
    display: block; font-size: 10px; letter-spacing: 0.16em;
    color: var(--muted-deep); margin-bottom: 8px;
  }
  .pf-input {
    width: 100%; height: 48px; border-radius: 8px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(240,239,236,0.12);
    color: var(--ink-soft); font-size: 14px; padding: 0 14px;
    font-family: inherit;
  }
  .pf-field-hint {
    display: block; margin-top: 8px; font-size: 10.5px;
    color: var(--muted-deep); line-height: 1.6;
  }

  .pf-note {
    margin: 26px 28px 0; padding: 12px 14px;
    background: rgba(200,120,80,0.07);
    border-left: 2px solid rgba(200,120,80,0.5);
    font-size: 11px; line-height: 1.8; color: #b08a6e;
  }

  .pf-save {
    position: absolute; left: 28px; right: 28px; bottom: 52px;
    height: 50px; border-radius: 8px;
    background: rgba(201,168,106,0.14); border: 1px solid var(--gold);
    color: var(--gold); font-size: 15px; letter-spacing: 0.24em;
    font-family: inherit;
  }

  /* ---------- 3/4. 我的 ---------- */
  .page-mine { padding: 76px 0 0; }
  .me-profile { display: flex; align-items: center; gap: 16px; padding: 16px 24px 30px; }
  .me-avatar {
    width: 62px; height: 62px; border-radius: 50%;
    background: #1e1e1e; border: 1px solid rgba(240,239,236,0.1);
    display: grid; place-items: center; font-size: 26px;
    filter: grayscale(1) opacity(.45);
  }
  .me-avatar.is-set {
    background-size: cover; background-position: center;
    filter: none; border-color: rgba(201,168,106,0.3);
  }
  .me-info { display: flex; flex-direction: column; gap: 5px; }
  .me-name { font-family: var(--serif); font-size: 19px; letter-spacing: 0.06em; color: var(--ink); }
  .me-sub { font-size: 11px; color: var(--muted-deep); letter-spacing: 0.04em; }

  .me-list { border-top: 1px solid rgba(240,239,236,0.07); }
  .me-list.is-top { border-top: 0; margin-top: 20px; }
  .me-item {
    display: flex; align-items: center; gap: 14px;
    padding: 18px 24px; border-bottom: 1px solid rgba(240,239,236,0.055);
  }
  .mi-icon { font-size: 15px; color: var(--muted); width: 18px; text-align: center; }
  .mi-label { flex: 1; font-size: 14px; color: var(--ink-soft); }
  .mi-value { font-size: 12px; color: var(--muted-deep); }
  .mi-arrow { font-size: 16px; color: var(--muted-deep); }

  .note {
    max-width: 1700px; margin: 50px auto 0; padding: 18px 20px;
    border-left: 2px solid var(--gold); background: rgba(201,168,106,0.05);
    font-size: 12px; line-height: 2; color: var(--muted);
  }
  .note b { color: var(--ink-soft); font-weight: 400; }
  .note code { color: var(--gold); font-size: 11.5px; }
</style>
</head>
<body>

<div class="doc-head">
  <h1>授权流程 · 实际体验</h1>
  <p>
    这是「弹窗引导授权」的完整流程。注意用户要点多少次、填多少次，
    以及授权完成后到底能在哪里看到效果。
  </p>
</div>

<div class="screens">

  <div class="wrap">
    ${screenDialog()}
    <div class="cap">
      <span class="tag tag-warn">第 1 步 · 打扰</span>
      <b>首次进入弹窗</b>
      <span>用户刚打开就弹窗。<br>大多数人的第一反应是找「以后再说」在哪。</span>
    </div>
  </div>

  <div class="wrap">
    ${screenProfile()}
    <div class="cap">
      <span class="tag tag-num">第 2 步 · 5 次操作</span>
      <b>授权页（头像昵称分开）</b>
      <span>微信不允许自动获取：<br>
      点头像按钮 → 选图 → 点昵称框 → 打字 → 保存。<br>
      中途放弃就前功尽弃。</span>
    </div>
  </div>

  <div class="wrap">
    ${screenMineAfter()}
    <div class="cap">
      <span class="tag tag-ok">第 3 步 · 填完了</span>
      <b>授权后的「我的」</b>
      <span>终于有头像和昵称了。<br>
      但注意：<b>除了这里，别的地方看不到。</b></span>
    </div>
  </div>

  <div class="wrap">
    ${screenMineSimple()}
    <div class="cap">
      <span class="tag tag-ok">对照 · 推荐</span>
      <b>不做授权的「我的」</b>
      <span>功能一个不少，用户少做 5 步操作。<br>
      「我赞过的」同样有归属感。</span>
    </div>
  </div>

</div>

<div class="note">
  <b>关键结论</b><br>
  · 用户为了这个功能要操作 <b>5 次</b>（点头像 → 选图 → 点昵称框 → 输入 → 保存）<br>
  · 授权完成后，头像昵称<b>只在「我的」页面出现一次</b>，其他任何地方都看不到<br>
  · 静默登录（<code>wx.login</code>）已经能识别用户，收藏点赞全部正常，<b>零打扰</b><br>
  · 两者的功能差别：<b>没有</b>。唯一的差别是「我的」页顶部有没有头像
</div>

</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'auth-flow.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'auth-flow.html'));

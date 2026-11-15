/**
 * 摄影集页 · 原生 tabBar 效果预览
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots', 'mp-proto');

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>摄影集页 · 原生 tabBar</title>
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
  .doc-head { max-width: 1300px; margin: 0 auto 40px; }
  .doc-head h1 { font-family: var(--serif); font-weight: 400; font-size: 27px; letter-spacing: 0.14em; }
  .doc-head p { margin-top: 12px; font-size: 13px; line-height: 1.9; color: var(--muted); max-width: 820px; }

  .screens { display: flex; gap: 56px; max-width: 1300px; margin: 0 auto; }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .cap { text-align: center; }
  .cap b { display: block; font-size: 13px; font-weight: 400; color: var(--ink-soft); margin-bottom: 5px; }
  .cap span { font-size: 11px; color: var(--muted-deep); }

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

  /* 状态栏 */
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

  /* 微信胶囊 —— 模拟右上角那个东西 */
  .capsule {
    position: absolute; right: 14px; top: 52px; z-index: 50;
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
  .capsule .circle::after {
    content: ''; width: 6px; height: 6px; border-radius: 50%; background: #fff;
  }
  .capsule .divider { width: 1px; height: 16px; background: rgba(255,255,255,0.2); }

  /* 头部 */
  .page-head { padding: 10px 18px 14px; }
  .page-title {
    font-family: var(--serif); font-size: 22px;
    letter-spacing: 0.16em; color: var(--ink);
  }

  /* 相册网格 */
  .scroll-area { flex: 1; overflow: hidden; padding-bottom: 60px; }
  .grid { display: flex; flex-wrap: wrap; padding: 0 14px 20px; }
  .album { width: calc(50% - 4px); margin-bottom: 11px; }
  .album:nth-child(odd) { margin-right: 8px; }
  .cover-wrap {
    position: relative; width: 100%; aspect-ratio: 3/4;
    border-radius: 4px; overflow: hidden; background: #141414;
    box-shadow: 0 3px 14px rgba(0,0,0,0.5);
  }
  .cover { width: 100%; height: 100%; object-fit: cover; display: block; }
  .cover-shade {
    position: absolute; left: 0; right: 0; bottom: 0; height: 55%;
    background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 55%, transparent 100%);
  }
  .cover-text { position: absolute; left: 10px; right: 10px; bottom: 9px; }
  .cn {
    font-family: var(--serif); font-size: 16px; letter-spacing: 0.08em;
    color: #fff; text-shadow: 0 1px 8px rgba(0,0,0,0.8);
  }
  .en {
    margin-top: 3px; font-size: 8.5px; letter-spacing: 0.18em;
    color: rgba(255,255,255,0.55); text-transform: uppercase;
  }
  .count { margin-top: 6px; font-size: 11px; color: var(--muted-deep); }

  /* 悬浮筛选按钮 */
  .fab {
    position: absolute; right: 16px; bottom: 90px; z-index: 80;
    display: flex; align-items: center; gap: 5px;
    height: 38px; padding: 0 14px; border-radius: 19px;
    background: rgba(28,28,28,0.94);
    border: 1px solid rgba(201,168,106,0.32);
    backdrop-filter: blur(20px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.6);
    font-size: 12px; color: var(--gold);
  }
  .fab-icon { font-size: 12px; }

  /* 原生 tabBar（系统绘制，纯色无图标纹理也可以） */
  .native-tabbar {
    position: absolute; left: 0; right: 0; bottom: 0;
    height: 50px; padding-bottom: 20px;
    background: #0d0d0d;
    border-top: 0.5px solid rgba(255,255,255,0.12);
    display: flex; z-index: 100;
  }
  .ntab {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 2px;
    color: var(--muted-deep); font-size: 10px;
  }
  .ntab.is-active { color: var(--gold); }
  .ntab img { width: 24px; height: 24px; display: block; }

  /* 底部筛选面板 */
  .sheet-mask {
    position: absolute; left: 0; right: 0; top: 0; bottom: 0;
    background: rgba(0,0,0,0.6); z-index: 200;
    opacity: 0; pointer-events: none; transition: opacity 0.26s ease;
  }
  .sheet-mask.is-open { opacity: 1; pointer-events: auto; }

  .sheet {
    position: absolute; left: 0; right: 0; bottom: 70px; z-index: 201;
    background: #161616;
    border-radius: 14px 14px 0 0;
    border-top: 1px solid rgba(240,239,236,0.09);
    padding: 8px 0 10px;
    transform: translateY(calc(100% + 80px));
    transition: transform 0.28s cubic-bezier(0.16,1,0.3,1);
  }
  .sheet.is-open { transform: translateY(0); }

  .sheet-handle {
    width: 34px; height: 3px; border-radius: 2px;
    background: rgba(240,239,236,0.18);
    margin: 0 auto 12px;
  }
  .sheet-title {
    padding: 0 20px 10px; font-size: 11.5px;
    letter-spacing: 0.16em; color: var(--muted-deep);
  }
  .sheet-list { padding: 0 10px; }
  .sheet-item {
    display: flex; align-items: center;
    height: 52px; padding: 0 10px; border-radius: 6px;
  }
  .sheet-item.is-active { background: rgba(201,168,106,0.08); }
  .si-label { flex: 1; font-size: 15px; color: var(--ink-soft); }
  .sheet-item.is-active .si-label { color: var(--gold); }
  .si-count { font-size: 11px; color: var(--muted-deep); margin-right: 8px; }
  .si-check { font-size: 13px; color: var(--gold); width: 16px; text-align: right; }
</style>
</head>
<body>

<div class="doc-head">
  <h1>摄影集页 · 原生 tabBar</h1>
  <p>
    改用微信原生 tabBar。筛选按钮从右上角（会被胶囊挡住）移到右下角悬浮。
    底部弹出面板停在原生 tabBar 上方，不被遮挡。
  </p>
</div>

<div class="screens">

  <!-- 正常状态 -->
  <div class="wrap">
    <div class="phone"><div class="phone-screen">
      <div class="status-bar">
        <span>12:59</span>
        <span class="sb-right">
          <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
          <span class="sb-battery"><i></i></span>
        </span>
      </div>

      <!-- 微信胶囊 -->
      <div class="capsule">
        <span class="dots">•••</span>
        <span class="divider"></span>
        <span class="circle"></span>
      </div>

      <div class="page-head"><div class="page-title">摄影集</div></div>

      <div class="scroll-area">
        <div class="grid">
          <div class="album">
            <div class="cover-wrap">
              <img class="cover" src="scenery-0.jpg" />
              <div class="cover-shade"></div>
              <div class="cover-text"><div class="cn">山水之间</div><div class="en">Between Mountains</div></div>
            </div>
            <div class="count">11 张</div>
          </div>
          <div class="album">
            <div class="cover-wrap">
              <img class="cover" src="kids-0.jpg" />
              <div class="cover-shade"></div>
              <div class="cover-text"><div class="cn">童年纪事</div><div class="en">Childhood Days</div></div>
            </div>
            <div class="count">27 张</div>
          </div>
          <div class="album">
            <div class="cover-wrap">
              <img class="cover" src="people-0.jpg" />
              <div class="cover-shade"></div>
              <div class="cover-text"><div class="cn">人物光影</div><div class="en">Portraits</div></div>
            </div>
            <div class="count">12 张</div>
          </div>
        </div>
      </div>

      <div class="fab">
        <span class="fab-icon">▤</span>
        <span>全部</span>
      </div>

      <div class="native-tabbar">
        <div class="ntab">
          <img src="../../chenbin-light-mp/miniprogram/images/tab-home.png" alt="" />
          <span>首页</span>
        </div>
        <div class="ntab is-active">
          <img src="../../chenbin-light-mp/miniprogram/images/tab-grid-on.png" alt="" />
          <span>摄影集</span>
        </div>
        <div class="ntab">
          <img src="../../chenbin-light-mp/miniprogram/images/tab-user.png" alt="" />
          <span>我的</span>
        </div>
      </div>

      <div class="sheet-mask"></div>
      <div class="sheet">
        <div class="sheet-handle"></div>
        <div class="sheet-title">选择摄影集</div>
        <div class="sheet-list"></div>
      </div>
    </div></div>
    <div class="cap">
      <b>正常状态</b>
      <span>筛选按钮在右下角，避开微信胶囊</span>
    </div>
  </div>

  <!-- 筛选展开 -->
  <div class="wrap">
    <div class="phone"><div class="phone-screen">
      <div class="status-bar">
        <span>12:59</span>
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

      <div class="page-head"><div class="page-title">摄影集</div></div>

      <div class="scroll-area">
        <div class="grid">
          <div class="album">
            <div class="cover-wrap">
              <img class="cover" src="scenery-0.jpg" />
              <div class="cover-shade"></div>
              <div class="cover-text"><div class="cn">山水之间</div><div class="en">Between Mountains</div></div>
            </div>
            <div class="count">11 张</div>
          </div>
          <div class="album">
            <div class="cover-wrap">
              <img class="cover" src="kids-0.jpg" />
              <div class="cover-shade"></div>
              <div class="cover-text"><div class="cn">童年纪事</div><div class="en">Childhood Days</div></div>
            </div>
            <div class="count">27 张</div>
          </div>
        </div>
      </div>

      <div class="sheet-mask is-open"></div>
      <div class="sheet is-open">
        <div class="sheet-handle"></div>
        <div class="sheet-title">选择摄影集</div>
        <div class="sheet-list">
          <div class="sheet-item is-active">
            <span class="si-label">全部</span>
            <span class="si-count">5 个相册</span>
            <span class="si-check">✓</span>
          </div>
          <div class="sheet-item">
            <span class="si-label">风光摄影集</span>
            <span class="si-count">2 个相册</span>
            <span class="si-check"></span>
          </div>
          <div class="sheet-item">
            <span class="si-label">儿童摄影集</span>
            <span class="si-count">2 个相册</span>
            <span class="si-check"></span>
          </div>
          <div class="sheet-item">
            <span class="si-label">人像摄影集</span>
            <span class="si-count">1 个相册</span>
            <span class="si-check"></span>
          </div>
        </div>
      </div>

      <div class="native-tabbar">
        <div class="ntab">
          <img src="../../chenbin-light-mp/miniprogram/images/tab-home.png" alt="" />
          <span>首页</span>
        </div>
        <div class="ntab is-active">
          <img src="../../chenbin-light-mp/miniprogram/images/tab-grid-on.png" alt="" />
          <span>摄影集</span>
        </div>
        <div class="ntab">
          <img src="../../chenbin-light-mp/miniprogram/images/tab-user.png" alt="" />
          <span>我的</span>
        </div>
      </div>
    </div></div>
    <div class="cap">
      <b>筛选展开</b>
      <span>面板停在 tabBar 上方，完全不被遮挡</span>
    </div>
  </div>

</div>

</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'native-tabbar.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'native-tabbar.html'));

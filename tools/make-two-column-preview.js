/**
 * 摄影集页 · 顶部 chip + 双列网格 预览
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots', 'mp-proto');
const ICON_DIR = path.join(__dirname, '..', 'miniprogram', 'images');

const b64 = (f) => {
  const p = path.join(ICON_DIR, f);
  if (!fs.existsSync(p)) return '';
  return 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');
};

const ICONS = {
  home: b64('tab-home.png'),
  gridOn: b64('tab-grid-on.png'),
  user: b64('tab-user.png'),
};

const ALBUMS = [
  { img: 'scenery-0.jpg', cn: '山水之间', en: 'Between Mountains', n: 11 },
  { img: 'kids-0.jpg', cn: '童年纪事', en: 'Childhood Days', n: 27 },
  { img: 'people-0.jpg', cn: '人物光影', en: 'Portraits', n: 12 },
  { img: 'scenery-2.jpg', cn: '神都洛阳', en: 'Luoyang', n: 16 },
  { img: 'kids-3.jpg', cn: '兜兜满月了', en: 'One Month', n: 4, lock: true },
  { img: 'people-2.jpg', cn: '街头纪实', en: 'Street', n: 9 },
];

function phone(activeChip) {
  const chips = ['全部', '风光摄影集', '儿童摄影集', '人像摄影集'];
  const cards = ALBUMS.map(
    (a) => `
    <div class="album">
      <div class="cover-wrap">
        <img class="cover" src="${a.img}" />
        <div class="cover-shade"></div>
        ${a.lock ? '<div class="badge">🔒</div>' : ''}
        <div class="cover-text">
          <div class="cn">${a.cn}</div>
          <div class="en">${a.en}</div>
        </div>
      </div>
      <div class="count">${a.n} 张</div>
    </div>`
  ).join('');

  return `
  <div class="phone"><div class="phone-screen">
    <div class="status-bar">
      <span>13:30</span>
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

    <div class="chips">
      ${chips.map((c) => `<div class="chip ${c === activeChip ? 'is-active' : ''}">${c}</div>`).join('')}
    </div>

    <div class="scroll-area">
      <div class="grid">${cards}</div>
    </div>

    <div class="native-tabbar">
      <div class="ntab"><img src="${ICONS.home}" /><span>首页</span></div>
      <div class="ntab is-active"><img src="${ICONS.gridOn}" /><span>摄影集</span></div>
      <div class="ntab"><img src="${ICONS.user}" /><span>我的</span></div>
    </div>
  </div></div>`;
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>摄影集页 · 双列网格</title>
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
  .doc-head p { margin-top: 12px; font-size: 13px; line-height: 1.9; color: var(--muted); max-width: 800px; }

  .screens { display: flex; gap: 56px; max-width: 1200px; margin: 0 auto; }
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
  .capsule .circle::after { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #fff; }
  .capsule .divider { width: 1px; height: 16px; background: rgba(255,255,255,0.2); }

  .page-head { padding: 10px 18px 10px; }
  .page-title {
    font-family: var(--serif); font-size: 22px;
    letter-spacing: 0.16em; color: var(--ink);
  }

  .chips {
    display: flex; gap: 8px; padding: 0 18px 12px;
    white-space: nowrap; overflow: hidden;
  }
  .chip {
    display: inline-flex; align-items: center; flex: 0 0 auto;
    height: 30px; padding: 0 14px; border-radius: 15px;
    border: 1px solid rgba(240,239,236,0.1);
    font-size: 12px; color: var(--muted);
  }
  .chip.is-active {
    border-color: var(--gold); color: var(--gold);
    background: rgba(201,168,106,0.1);
  }

  .scroll-area { flex: 1; overflow: hidden; padding-bottom: 60px; }

  .grid { display: flex; flex-wrap: wrap; padding: 0 14px; }
  .album {
    /* 双列：padding 14×2=28，间距 8，单列 = (100% - 36) / 2 */
    width: calc((100% - 36px) / 2);
    margin-bottom: 11px;
  }
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
  .badge {
    position: absolute; top: 8px; right: 8px;
    width: 24px; height: 24px; border-radius: 50%;
    background: rgba(0,0,0,0.55);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; z-index: 3;
  }
  .count { margin-top: 6px; font-size: 11px; color: var(--muted-deep); }

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
  <h1>摄影集页 · 双列网格</h1>
  <p>筛选回到顶部横向 chip，相册改回双列。左图「全部」，右图选中「风光摄影集」的样子。</p>
</div>

<div class="screens">
  <div class="wrap">
    ${phone('全部')}
    <div class="cap"><b>全部</b><span>默认展示所有相册，双列</span></div>
  </div>
  <div class="wrap">
    ${phone('风光摄影集')}
    <div class="cap"><b>选中「风光摄影集」</b><span>chip 高亮金色，只显示风光下的相册</span></div>
  </div>
</div>

<div class="note">
  <b>单列的原因</b><br>
  之前卡片宽 <code>calc(50% - 8rpx)</code> 又加 <code>margin-right: 16rpx</code>，
  总宽变成 <code>50% + 8rpx</code>，超出容器 → 一行放不下两个 → 掉成单列。<br>
  现在改成 <code>calc((100% - 72rpx) / 2)</code>，把间距和 padding 都算进去，稳定双列。
</div>

</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'two-column.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'two-column.html'));

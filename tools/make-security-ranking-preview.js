/**
 * 账号安全 + 作品排行 界面预览
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots', 'mp-proto');

// 用真实照片做缩略图
const IMG_DIR = path.join(__dirname, '..', '..', 'chenbin-light', 'shots', 'mp-proto');
const b64 = (f) => {
  const p = path.join(IMG_DIR, f);
  if (!fs.existsSync(p)) return '';
  return 'data:image/jpeg;base64,' + fs.readFileSync(p).toString('base64');
};

const RANK_ITEMS = [
  { no: '01', img: 'scenery-0.jpg', title: 'DSC_0783', album: '山水之间', count: 3 },
  { no: '02', img: 'kids-0.jpg', title: 'DSC_3354', album: '童年纪事', count: 2 },
  { no: '03', img: 'people-0.jpg', title: 'mmexport1665856918450', album: '人物光影', count: 2 },
  { no: '04', img: 'scenery-2.jpg', title: 'DSC_7304', album: '神都洛阳', count: 1 },
  { no: '05', img: 'kids-3.jpg', title: 'DSC_3304', album: '童年纪事', count: 1 },
];

function rankRow(it) {
  return `
    <div class="rank-row">
      <span class="rank-no${parseInt(it.no) <= 3 ? ' is-top' : ''}">${it.no}</span>
      <img class="rank-thumb" src="${b64(it.img)}" />
      <div class="rank-info">
        <div class="rank-title">${it.title}</div>
        <div class="rank-album">${it.album}</div>
      </div>
      <span class="rank-count"><b>${it.count}</b> ♥</span>
      <span class="rank-arrow">›</span>
    </div>`;
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>账号安全 + 作品排行</title>
<style>
  :root {
    --bg: #0d0d0d; --ink: #f0efec; --ink-soft: #c8c6c1;
    --muted: #8a8884; --muted-deep: #5a5956; --gold: #c9a86a;
    --serif: "Songti SC","SimSun",Georgia,serif;
    --sans: -apple-system, "PingFang SC", "Helvetica Neue", sans-serif;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #070707; color: var(--ink); font-family: var(--sans);
    padding: 44px 36px 72px; -webkit-font-smoothing: antialiased;
  }
  .doc-head { max-width: 1300px; margin: 0 auto 44px; }
  .doc-head h1 { font-family: var(--serif); font-weight: 400; font-size: 27px; letter-spacing: 0.14em; }
  .doc-head p { margin-top: 12px; font-size: 13px; line-height: 1.9; color: var(--muted); max-width: 820px; }

  .screens { display: flex; gap: 40px; max-width: 1300px; margin: 0 auto; align-items: flex-start; }
  .panel {
    flex: 1;
    background: #0d0d0d;
    border: 1px solid rgba(240,239,236,0.08);
    border-radius: 12px;
    overflow: hidden;
  }
  .panel-head {
    padding: 18px 22px;
    border-bottom: 1px solid rgba(240,239,236,0.07);
    display: flex; align-items: center; gap: 12px;
  }
  .panel-head .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gold); }
  .panel-head b { font-size: 13px; font-weight: 400; color: var(--ink-soft); letter-spacing: 0.06em; }
  .panel-body { padding: 26px 24px 30px; }

  .cap { margin-top: 14px; text-align: center; font-size: 11px; color: var(--muted-deep); }

  /* ============ 通用 ============ */
  h1.ch { font-family: var(--serif); font-size: 24px; font-weight: 400; letter-spacing: 0.1em; color: var(--ink); margin-bottom: 10px; }
  h1.ch .en { font-family: var(--sans); font-size: 11px; letter-spacing: 0.24em; color: var(--muted-deep); margin-left: 12px; text-transform: uppercase; }
  .desc { font-size: 12.5px; line-height: 1.8; color: var(--muted-deep); margin-bottom: 28px; max-width: 520px; }

  .field { display: block; margin-bottom: 20px; }
  .field > span { display: block; font-size: 11.5px; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 8px; }
  .inp {
    width: 100%; height: 40px; padding: 0 14px;
    border: 1px solid rgba(240,239,236,0.12); border-radius: 7px;
    background: rgba(255,255,255,0.02); color: var(--ink);
    font-size: 13.5px; font-family: inherit;
  }
  .inp::placeholder { color: #3d3c3a; }
  .inp:focus { outline: none; border-color: rgba(201,168,106,0.5); }

  .strength { font-size: 12px; margin-bottom: 18px; }
  .strength.is-good { color: #9fb87a; }

  .actions {
    display: flex; align-items: center; justify-content: flex-end; gap: 16px;
    padding-top: 18px; border-top: 1px solid rgba(240,239,236,0.08);
  }
  .btn-gold {
    padding: 10px 26px; border-radius: 7px;
    border: 1px solid var(--gold);
    background: rgba(201,168,106,0.1);
    color: var(--gold); font-size: 13.5px;
    letter-spacing: 0.1em; font-family: inherit;
    cursor: pointer;
  }

  .tips {
    margin-top: 30px; padding: 20px 22px;
    border-radius: 10px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(240,239,236,0.07);
  }
  .tips h3 { font-size: 12px; letter-spacing: 0.12em; color: var(--muted); margin-bottom: 14px; font-weight: 400; }
  .tips ul { margin: 0; padding-left: 18px; font-size: 12.5px; line-height: 2; color: var(--muted-deep); }

  /* ============ 排行 ============ */
  .rank-stats { display: flex; gap: 12px; margin-bottom: 24px; }
  .rank-stat {
    flex: 1; padding: 16px 18px; border-radius: 9px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(240,239,236,0.07);
    display: flex; flex-direction: column; gap: 5px;
  }
  .rs-num { font-size: 24px; color: var(--gold); line-height: 1; }
  .rs-label { font-size: 11px; letter-spacing: 0.1em; color: var(--muted-deep); }

  .rank-tabs { display: flex; gap: 8px; margin-bottom: 18px; }
  .rank-tab {
    padding: 8px 18px; border-radius: 18px;
    border: 1px solid rgba(240,239,236,0.1);
    background: transparent; color: var(--muted);
    font-size: 12.5px; font-family: inherit; cursor: pointer;
  }
  .rank-tab.is-active {
    border-color: var(--gold); background: rgba(201,168,106,0.12); color: var(--gold);
  }

  .rank-list { display: flex; flex-direction: column; gap: 2px; }
  .rank-row {
    display: flex; align-items: center; gap: 14px;
    padding: 11px 12px; border-radius: 7px;
  }
  .rank-row:hover { background: rgba(255,255,255,0.035); }
  .rank-no {
    flex: 0 0 auto; width: 26px; font-size: 12.5px;
    color: var(--muted-deep); text-align: center;
    font-variant-numeric: tabular-nums;
  }
  .rank-no.is-top { color: var(--gold); font-weight: 600; }
  .rank-thumb {
    flex: 0 0 auto; width: 52px; height: 52px;
    border-radius: 5px; object-fit: cover; background: #141414;
  }
  .rank-info { flex: 1; min-width: 0; }
  .rank-title {
    font-size: 13px; color: var(--ink-soft);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .rank-album { margin-top: 3px; font-size: 11px; color: var(--muted-deep); }
  .rank-count {
    flex: 0 0 auto; font-size: 12px; color: var(--muted);
    display: flex; align-items: baseline; gap: 3px;
  }
  .rank-count b { font-size: 16px; font-weight: 400; color: var(--gold); }
  .rank-arrow { flex: 0 0 auto; font-size: 15px; color: var(--muted-deep); }

  /* ============ 明细弹窗 ============ */
  .modal {
    background: #141414; border: 1px solid rgba(240,239,236,0.1);
    border-radius: 12px; padding: 22px;
    max-width: 480px;
  }
  .modal h3 { font-size: 15px; font-weight: 400; color: var(--ink); margin-bottom: 8px; }
  .modal .path {
    font-family: monospace; font-size: 11px; color: var(--muted-deep);
    word-break: break-all; margin-bottom: 14px;
  }
  .rd-summary {
    padding: 11px 13px; border-radius: 7px;
    background: rgba(201,168,106,0.08);
    border: 1px solid rgba(201,168,106,0.2);
    font-size: 12px; color: var(--muted); margin-bottom: 12px;
  }
  .rd-summary b { color: var(--gold); font-weight: 400; }
  .rd-rows { display: flex; flex-direction: column; gap: 1px; }
  .rd-row {
    display: flex; align-items: center; gap: 12px;
    padding: 9px 11px; border-radius: 5px; font-size: 12px;
  }
  .rd-row:nth-child(odd) { background: rgba(255,255,255,0.022); }
  .rd-user { flex: 0 0 auto; width: 78px; color: var(--ink-soft); }
  .rd-openid { flex: 0 0 auto; width: 68px; font-family: monospace; font-size: 11px; color: var(--muted-deep); }
  .rd-time { flex: 1; text-align: right; color: var(--muted-deep); font-variant-numeric: tabular-nums; }
  .rd-note {
    margin-top: 14px; padding: 11px 13px;
    border-left: 2px solid rgba(201,168,106,0.4);
    background: rgba(201,168,106,0.04);
    font-size: 11px; line-height: 1.8; color: var(--muted-deep);
  }
  .modal-actions { display: flex; justify-content: flex-end; margin-top: 18px; }
  .btn-solid {
    padding: 9px 22px; border-radius: 7px;
    border: 1px solid rgba(201,168,106,0.5);
    background: rgba(201,168,106,0.14);
    color: var(--gold); font-size: 13px; font-family: inherit; cursor: pointer;
  }

  .note {
    max-width: 1300px; margin: 44px auto 0; padding: 18px 20px;
    border-left: 2px solid var(--gold); background: rgba(201,168,106,0.05);
    font-size: 12.5px; line-height: 2.1; color: var(--muted);
  }
  .note b { color: var(--ink-soft); font-weight: 400; }
  .note code { color: var(--gold); font-size: 12px; }
</style>
</head>
<body>

<div class="doc-head">
  <h1>账号安全 + 作品排行</h1>
  <p>左：修改密码（带强度提示）。中：排行榜。右：点开某一条的明细。</p>
</div>

<div class="screens">

  <!-- 账号安全 -->
  <div class="panel">
    <div class="panel-head"><div class="dot"></div><b>账号安全</b></div>
    <div class="panel-body">
      <h1 class="ch">账号安全<span class="en">Security</span></h1>
      <p class="desc">修改管理员密码。修改成功后，所有已登录的设备会被强制退出。</p>

      <label class="field">
        <span>当前密码</span>
        <input class="inp" type="password" value="••••••••••" />
      </label>
      <label class="field">
        <span>新密码</span>
        <input class="inp" type="password" value="••••••••••••" />
      </label>
      <label class="field">
        <span>确认新密码</span>
        <input class="inp" type="password" value="••••••••••••" />
      </label>

      <div class="strength is-good">强度：较好</div>

      <div class="actions">
        <button class="btn-gold">修改密码</button>
      </div>

      <div class="tips">
        <h3>安全建议</h3>
        <ul>
          <li>至少 6 位，建议 10 位以上</li>
          <li>不要用生日、手机号、姓名拼音</li>
          <li>不要和其他网站用同一个密码</li>
          <li>如果怀疑密码泄露，立即修改</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- 排行榜 -->
  <div class="panel">
    <div class="panel-head"><div class="dot"></div><b>作品排行</b></div>
    <div class="panel-body">
      <h1 class="ch">作品排行<span class="en">Ranking</span></h1>
      <p class="desc">小程序里被点赞、收藏最多的照片。点任意一条可以看是谁点的。</p>

      <div class="rank-stats">
        <div class="rank-stat"><span class="rs-num">12</span><span class="rs-label">用户</span></div>
        <div class="rank-stat"><span class="rs-num">9</span><span class="rs-label">总点赞</span></div>
        <div class="rank-stat"><span class="rs-num">6</span><span class="rs-label">总收藏</span></div>
      </div>

      <div class="rank-tabs">
        <button class="rank-tab is-active">♥ 点赞排行</button>
        <button class="rank-tab">★ 收藏排行</button>
      </div>

      <div class="rank-list">
        ${RANK_ITEMS.map(rankRow).join('')}
      </div>
    </div>
  </div>

  <!-- 明细弹窗 -->
  <div class="panel">
    <div class="panel-head"><div class="dot"></div><b>点开后的明细</b></div>
    <div class="panel-body">
      <div class="modal">
        <h3>点赞明细</h3>
        <div class="path">landscape/scenery/DSC_0783.jpg</div>

        <div class="rd-summary">共 <b>3</b> 次点赞，来自 <b>3</b> 位用户</div>

        <div class="rd-rows">
          <div class="rd-row">
            <span class="rd-user">用户 #13</span>
            <span class="rd-openid">devuse…</span>
            <span class="rd-time">2026-11-15 20:31</span>
          </div>
          <div class="rd-row">
            <span class="rd-user">用户 #12</span>
            <span class="rd-openid">d7kf2a…</span>
            <span class="rd-time">2026-11-15 19:04</span>
          </div>
          <div class="rd-row">
            <span class="rd-user">用户 #8</span>
            <span class="rd-openid">m3p9xw…</span>
            <span class="rd-time">2026-11-14 08:22</span>
          </div>
        </div>

        <div class="rd-note">
          小程序没有收集用户头像和昵称，所以这里只能显示用户编号。同一个人每次都是同一个编号。
        </div>

        <div class="modal-actions">
          <button class="btn-solid">关闭</button>
        </div>
      </div>
    </div>
  </div>

</div>

<div class="note">
  <b>修改密码</b><br>
  校验顺序：旧密码正确 → 新密码 ≥ 6 位 → 两次一致 → 不能和旧密码相同<br>
  修改成功后<b>清除所有会话</b>，所有设备强制重新登录 —— 这样密码即使被偷，改完对方立刻失效<br>
  <br>
  <b>排行榜</b><br>
  点赞排行 / 收藏排行，各取前 10 名。顶部显示用户数、总点赞、总收藏<br>
  点任意一条 → 弹出明细，显示「用户编号 + openid 前 6 位 + 时间」<br>
  <br>
  <b>关于「被谁点赞」的诚实说明</b><br>
  小程序<b>没有收集头像昵称</b>（这是你之前定的：静默登录，不索取隐私）。<br>
  所以这里只能显示用户编号（数据库自增 ID），不是名字。<br>
  同一个人每次都是同一个编号，所以能看出「几个人点了」「是不是同一批人」。
</div>

</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'security-ranking.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'security-ranking.html'));

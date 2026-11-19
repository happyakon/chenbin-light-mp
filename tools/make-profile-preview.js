/**
 * 生成「我的」和「完善资料」页预览
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots');
fs.mkdirSync(OUT, { recursive: true });

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #141414; padding: 40px;
    font-family: -apple-system, "PingFang SC", sans-serif;
    display: flex; gap: 44px; justify-content: center; align-items: flex-start;
  }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; }

  .phone {
    width: 360px; height: 700px; background: #0d0d0d;
    border-radius: 34px; overflow: hidden; position: relative;
    box-shadow: 0 0 0 2px rgba(255,255,255,.08), 0 16px 40px rgba(0,0,0,.7);
    display: flex; flex-direction: column;
  }
  .sbar { height: 44px; flex: 0 0 auto; }

  /* ---------- 我的 ---------- */
  .head { padding: 10px 18px 20px; }
  .title { font-family: "Songti SC", serif; font-size: 22px; letter-spacing: .16em; color: #f0efec; }

  .pcard {
    display: flex; align-items: center; gap: 14px;
    margin: 0 18px 22px; padding: 16px;
    border-radius: 10px;
    border: 1px solid rgba(240,239,236,.08);
    background: rgba(255,255,255,.018);
  }
  .av {
    width: 56px; height: 56px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: rgba(201,168,106,.1);
    border: 1px solid rgba(201,168,106,.28);
    font-family: "Songti SC", serif; font-size: 22px; color: #c9a86a;
    flex: 0 0 auto;
  }
  .av-img {
    background: linear-gradient(135deg, #4a5a6a, #2a3540);
    color: #fff; font-size: 18px;
  }
  .pbody { flex: 1; min-width: 0; }
  .pname { font-size: 16px; color: #f0efec; letter-spacing: .04em; }
  .phint { margin-top: 5px; font-size: 11px; color: #5a5956; }
  .parrow { color: #5a5956; font-size: 16px; }

  .list { border-top: 1px solid rgba(240,239,236,.07); }
  .row {
    display: flex; align-items: center; gap: 12px;
    padding: 18px;
    border-bottom: 1px solid rgba(240,239,236,.055);
  }
  .ricon { width: 18px; font-size: 15px; color: #8a8884; text-align: center; }
  .rlabel { flex: 1; font-size: 15px; color: #c8c6c1; letter-spacing: .04em; }
  .rval { font-size: 12px; color: #5a5956; }
  .rarr { font-size: 16px; color: #5a5956; }

  /* ---------- 完善资料 ---------- */
  .nav { display: flex; align-items: center; padding: 6px 12px; position: relative; }
  .back { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #c8c6c1; padding-bottom: 3px; }
  .navtitle { position: absolute; left: 50%; transform: translateX(-50%); font-size: 15px; letter-spacing: .1em; color: #f0efec; }
  .save {
    margin-left: auto; padding: 5px 12px; border-radius: 15px;
    border: 1px solid rgba(201,168,106,.42);
    background: rgba(201,168,106,.08); color: #c9a86a;
    font-size: 13px; letter-spacing: .06em;
  }

  .content { flex: 1; padding: 20px 24px; }

  .avsec { display: flex; flex-direction: column; align-items: center; margin-bottom: 32px; }
  .avwrap { position: relative; width: 84px; height: 84px; }
  .bigav {
    width: 84px; height: 84px; border-radius: 50%;
    background: linear-gradient(135deg, #4a5a6a, #2a3540);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 26px;
  }
  .badge {
    position: absolute; right: -2px; bottom: -2px;
    width: 26px; height: 26px; border-radius: 50%;
    background: #1a1a1a; border: 1px solid rgba(201,168,106,.35);
    display: flex; align-items: center; justify-content: center; font-size: 12px;
  }
  .avhint { margin-top: 10px; font-size: 12px; color: #5a5956; }

  .field { position: relative; padding-bottom: 6px; border-bottom: 1px solid rgba(240,239,236,.09); }
  .flabel { font-size: 12px; letter-spacing: .08em; color: #8a8884; margin-bottom: 9px; }
  .finput { font-size: 16px; color: #f0efec; letter-spacing: .04em; }
  .fcount { position: absolute; right: 0; bottom: 10px; font-size: 11px; color: #3d3c3a; }

  .tip { margin-top: 24px; font-size: 12px; line-height: 1.85; color: #5a5956; }

  .cap { font-size: 12px; color: #888; }
</style>
</head>
<body>

<!-- 我的 -->
<div class="wrap">
  <div class="phone">
    <div class="sbar"></div>
    <div class="head"><div class="title">我的</div></div>

    <div class="pcard">
      <div class="av">测</div>
      <div class="pbody">
        <div class="pname">测试用户</div>
        <div class="phint">点这里修改资料</div>
      </div>
      <div class="parrow">›</div>
    </div>

    <div class="list">
      <div class="row">
        <div class="ricon">☆</div>
        <div class="rlabel">我的收藏</div>
        <div class="rval">2 张</div>
        <div class="rarr">›</div>
      </div>
      <div class="row">
        <div class="ricon">♡</div>
        <div class="rlabel">我的点赞</div>
        <div class="rval">5 张</div>
        <div class="rarr">›</div>
      </div>
    </div>
  </div>
  <div class="cap">我的（已有资料）</div>
</div>

<!-- 完善资料 -->
<div class="wrap">
  <div class="phone">
    <div class="sbar"></div>
    <div class="nav">
      <div class="back">‹</div>
      <div class="navtitle">完善资料</div>
      <div class="save">保存</div>
    </div>
    <div class="content">
      <div class="avsec">
        <div class="avwrap">
          <div class="bigav">测</div>
          <div class="badge">📷</div>
        </div>
        <div class="avhint">点击更换头像</div>
      </div>
      <div class="field">
        <div class="flabel">昵称</div>
        <div class="finput">测试用户</div>
        <div class="fcount">4/20</div>
      </div>
      <div class="tip">
        昵称和头像会显示在排行榜、点赞列表里。不填的话显示「用户 #18」。
      </div>
    </div>
  </div>
  <div class="cap">完善资料</div>
</div>

<!-- 未设置资料时 -->
<div class="wrap">
  <div class="phone">
    <div class="sbar"></div>
    <div class="head"><div class="title">我的</div></div>

    <div class="pcard">
      <div class="av">18</div>
      <div class="pbody">
        <div class="pname">用户 #18</div>
        <div class="phint">完善头像和昵称</div>
      </div>
      <div class="parrow">›</div>
    </div>

    <div class="list">
      <div class="row">
        <div class="ricon">☆</div>
        <div class="rlabel">我的收藏</div>
        <div class="rval">0 张</div>
        <div class="rarr">›</div>
      </div>
      <div class="row">
        <div class="ricon">♡</div>
        <div class="rlabel">我的点赞</div>
        <div class="rval">0 张</div>
        <div class="rarr">›</div>
      </div>
    </div>
  </div>
  <div class="cap">我的（未设置资料）</div>
</div>

</body>
</html>`;

const file = path.join(OUT, 'mp-profile-preview.html');
fs.writeFileSync(file, html, 'utf8');
console.log('生成:', file);

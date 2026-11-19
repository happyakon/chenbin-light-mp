/**
 * 完善资料页 —— 修复后的布局预览
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
    display: flex; gap: 48px; justify-content: center; align-items: flex-start;
  }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; }

  .phone {
    width: 360px; height: 700px; background: #0d0d0d;
    border-radius: 34px; overflow: hidden; position: relative;
    box-shadow: 0 0 0 2px rgba(255,255,255,.08), 0 16px 40px rgba(0,0,0,.7);
    display: flex; flex-direction: column;
  }
  .sbar { height: 44px; flex: 0 0 auto; }

  .nav { display: flex; align-items: center; padding: 6px 12px; position: relative; flex: 0 0 auto; }
  .back { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #c8c6c1; padding-bottom: 3px; }
  .navtitle { position: absolute; left: 50%; transform: translateX(-50%); font-size: 15px; letter-spacing: .1em; color: #f0efec; }

  /* 微信胶囊按钮（系统画的，模拟出来看重叠关系） */
  .capsule {
    position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
    width: 88px; height: 32px; border-radius: 16px;
    border: 1px solid rgba(255,255,255,.16);
    background: rgba(0,0,0,.35);
    display: flex; align-items: center; justify-content: space-around;
    font-size: 13px; color: #ddd; z-index: 10;
  }
  .capsule .dot { letter-spacing: 2px; }
  .capsule .circ { width: 15px; height: 15px; border-radius: 50%; border: 2px solid #ddd; }

  .content { flex: 1; padding: 20px 24px; overflow: hidden; }

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

  .footer { flex: 0 0 auto; padding: 12px 24px 24px; }
  .savebtn {
    width: 100%; height: 46px; border-radius: 7px;
    border: 1px solid #c9a86a; background: rgba(201,168,106,.11);
    color: #c9a86a; font-size: 15px;
    letter-spacing: .24em; text-indent: .24em;
    display: flex; align-items: center; justify-content: center;
  }

  .cap { font-size: 12px; color: #888; text-align: center; max-width: 360px; line-height: 1.7; }
  .bad { color: #d98b8b; }
  .good { color: #7ec99a; }

  .mark {
    position: absolute; inset: 0; pointer-events: none;
    border: 2px dashed rgba(217,139,139,.5); border-radius: 34px;
    display: none;
  }
</style>
</head>
<body>

<!-- 修复前 -->
<div class="wrap">
  <div class="phone">
    <div class="sbar"></div>
    <div class="nav">
      <div class="back">‹</div>
      <div class="navtitle">完善资料</div>
      <!-- 冲突：保存按钮被胶囊盖住 -->
      <div style="margin-left:auto;padding:5px 12px;border-radius:15px;border:1px solid rgba(201,168,106,.42);background:rgba(201,168,106,.08);color:#c9a86a;font-size:13px;position:relative;z-index:1">保存</div>
      <div class="capsule"><span class="dot">···</span><span class="circ"></span></div>
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
      <div class="tip">昵称和头像会显示在排行榜、点赞列表里。不填的话显示「用户 #18」。</div>
    </div>
  </div>
  <div class="cap bad">修复前：保存按钮被右上角胶囊盖住，点不到</div>
</div>

<!-- 修复后 -->
<div class="wrap">
  <div class="phone">
    <div class="sbar"></div>
    <div class="nav">
      <div class="back">‹</div>
      <div class="navtitle">完善资料</div>
      <div class="capsule"><span class="dot">···</span><span class="circ"></span></div>
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
      <div class="tip">昵称和头像会显示在排行榜、点赞列表里。不填的话显示「用户 #18」。</div>
    </div>
    <div class="footer">
      <div class="savebtn">保 存</div>
    </div>
  </div>
  <div class="cap good">修复后：保存移到页面底部，不再和胶囊冲突</div>
</div>

</body>
</html>`;

const file = path.join(OUT, 'profile-layout-fix.html');
fs.writeFileSync(file, html, 'utf8');
console.log('生成:', file);

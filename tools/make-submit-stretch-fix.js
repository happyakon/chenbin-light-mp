/**
 * 精确模拟小程序布局，验证按钮宽度
 *
 * 关键：模拟真实的小程序渲染行为
 *   - .content 是 align-items: center 的 flex column
 *   - <button> 在这种容器里的真实表现
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots');
fs.mkdirSync(OUT, { recursive: true });

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #141414; padding: 30px;
    font-family: -apple-system, "PingFang SC", sans-serif;
    display: flex; gap: 40px; justify-content: center;
  }
  .col { display: flex; flex-direction: column; align-items: center; gap: 10px; }

  .phone {
    width: 350px; height: 640px; background: #0d0d0d;
    border-radius: 30px; overflow: hidden;
    box-shadow: 0 0 0 2px rgba(255,255,255,.08), 0 16px 40px rgba(0,0,0,.75);
    display: flex; flex-direction: column; position: relative;
  }
  .sbar { height: 44px; }
  .nav { padding: 6px 10px; }
  .back { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #c8c6c1; }

  .content {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 0 44px 110px;
    box-sizing: border-box;
    position: relative;
  }
  .edge { position: absolute; top: 0; bottom: 0; width: 1px; background: rgba(217,139,139,.55); }
  .edge.l { left: 44px; }
  .edge.r { right: 44px; }

  .lock-icon { font-size: 38px; margin-bottom: 18px; opacity: .85; line-height: 1; }
  .album-title {
    font-family: "Songti SC", "SimSun", serif;
    font-size: 24px; letter-spacing: .14em; color: #f0efec;
  }
  .hint { margin-top: 10px; font-size: 13px; color: #8a8884; }

  /* ---------- 修复前 ---------- */
  .input-wrap-old { width: 100%; margin-top: 40px; }
  .input {
    width: 100%; height: 50px;
    border: 1px solid rgba(240,239,236,.14);
    border-radius: 8px; background: rgba(255,255,255,.02);
    color: #f0efec; font-size: 16px; letter-spacing: .1em;
    text-align: center;
  }
  .submit-wrap-old { width: 100%; margin-top: 14px; }
  /* 模拟小程序 button 的真实行为：不撑满 */
  .submit-old {
    display: inline-block;
    width: auto;
    height: 50px;
    margin: 0 auto;
    padding: 0 26px;
    border-radius: 8px;
    border: 1px solid #c9a86a;
    background: rgba(201,168,106,.1);
    color: #c9a86a;
    font-size: 15px;
    letter-spacing: .3em;
    text-indent: .3em;
    line-height: 48px;
    text-align: center;
  }
  .warn-old { margin-top: 24px; font-size: 11px; color: #5a5956; }

  /* ---------- 修复后 ---------- */
  .input-wrap-new, .submit-wrap-new {
    /* 关键：stretch */
    align-self: stretch;
  }
  .input-wrap-new { margin-top: 40px; }
  .submit-wrap-new { margin-top: 14px; }
  .submit-new {
    display: flex; align-items: center; justify-content: center;
    width: 100%; height: 50px;
    margin: 0; padding: 0;
    border-radius: 8px;
    border: 1px solid #c9a86a;
    background: rgba(201,168,106,.1);
    color: #c9a86a;
    font-size: 15px;
    letter-spacing: .3em;
    text-indent: .3em;
    line-height: normal;
  }
  .warn-new { margin-top: 14px; font-size: 11px; color: #5a5956; }

  .cap { font-size: 12px; text-align: center; line-height: 1.7; max-width: 350px; }
  .cap.bad { color: #d98b8b; }
  .cap.good { color: #7ec99a; }
`;

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8" /><style>${css}</style></head>
<body>

<div class="col">
  <div class="phone">
    <div class="sbar"></div>
    <div class="nav"><div class="back">‹</div></div>
    <div class="content">
      <div class="edge l"></div><div class="edge r"></div>
      <div class="lock-icon">🔒</div>
      <div class="album-title">人物光影</div>
      <div class="hint">请输入密码后查看</div>
      <div class="input-wrap-old"><div class="input">输入密码</div></div>
      <div class="submit-wrap-old"><div class="submit-old">进 入</div></div>
      <div class="warn-old">连续错误 5 次将锁定 4 小时</div>
    </div>
  </div>
  <div class="cap bad">之前：按钮窄，提示字离得远（48rpx）</div>
</div>

<div class="col">
  <div class="phone">
    <div class="sbar"></div>
    <div class="nav"><div class="back">‹</div></div>
    <div class="content">
      <div class="edge l"></div><div class="edge r"></div>
      <div class="lock-icon">🔒</div>
      <div class="album-title">人物光影</div>
      <div class="hint">请输入密码后查看</div>
      <div class="input-wrap-new"><div class="input">输入密码</div></div>
      <div class="submit-wrap-new"><div class="submit-new">进 入</div></div>
      <div class="warn-new">连续错误 5 次将锁定 4 小时</div>
    </div>
  </div>
  <div class="cap good">现在：align-self: stretch<br>按钮贴住红线，提示字上移（28rpx）</div>
</div>

</body>
</html>`;

fs.writeFileSync(path.join(OUT, 'submit-stretch-fix.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'submit-stretch-fix.html'));

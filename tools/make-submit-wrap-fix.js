/**
 * 验证 submit-wrap 修复
 *
 * 关键：模拟「button 在 align-items:center 的 flex 容器里
 * 不会自动撑满」的真实行为。
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots');
fs.mkdirSync(OUT, { recursive: true });

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #141414; padding: 34px;
    font-family: -apple-system, "PingFang SC", sans-serif;
    display: flex; gap: 48px; justify-content: center; align-items: flex-start;
  }
  .col { display: flex; flex-direction: column; align-items: center; gap: 12px; }

  .phone {
    width: 340px; height: 620px; background: #0d0d0d;
    border-radius: 30px; overflow: hidden;
    box-shadow: 0 0 0 2px rgba(255,255,255,.08), 0 16px 40px rgba(0,0,0,.75);
    display: flex; flex-direction: column;
    position: relative;
  }
  .sbar { height: 44px; flex: 0 0 auto; }
  .nav { padding: 6px 10px; flex: 0 0 auto; }
  .back { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #c8c6c1; }

  .content {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 0 44px 110px;
    position: relative;
  }

  /* 左右边界参考线 */
  .edge { position: absolute; top: 0; bottom: 0; width: 1px; background: rgba(217,139,139,.5); }
  .edge.l { left: 44px; }
  .edge.r { right: 44px; }

  .lock-icon { font-size: 38px; margin-bottom: 20px; opacity: .85; line-height: 1; }
  .album-title {
    font-family: "Songti SC", "SimSun", serif;
    font-size: 24px; letter-spacing: .14em; color: #f0efec;
  }
  .hint { margin-top: 10px; font-size: 13px; color: #8a8884; }

  .input-wrap { width: 100%; margin-top: 40px; }
  .input {
    width: 100%; height: 50px;
    border: 1px solid rgba(240,239,236,.14);
    border-radius: 8px; background: rgba(255,255,255,.02);
    color: #f0efec; font-size: 16px; letter-spacing: .1em;
    text-align: center;
    display: flex; align-items: center; justify-content: center;
  }
  .ph { color: #3d3c3a; font-size: 14px; }

  /* ===== 修复前：button 直接在 flex 容器里 ===== */
  .submit-bare {
    /* 模拟小程序 button 的真实行为：不撑满，按内容宽度 */
    display: inline-block;
    width: auto;
    height: 50px;
    margin: 14px auto 0;
    padding: 0 28px;
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

  /* ===== 修复后：包一层全宽 view ===== */
  .submit-wrap { width: 100%; margin-top: 14px; }
  .submit {
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

  .warn { margin-top: 24px; font-size: 11px; color: #5a5956; }

  .cap { font-size: 12px; text-align: center; line-height: 1.7; max-width: 340px; }
  .cap.good { color: #7ec99a; }
  .cap.bad { color: #d98b8b; }
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
      <div class="input-wrap"><div class="input"><span class="ph">输入密码</span></div></div>
      <div class="submit-bare">进 入</div>
      <div class="warn">连续错误 5 次将锁定 4 小时</div>
    </div>
  </div>
  <div class="cap bad">改动前：button 在 flex 容器里不撑满<br>（按钮窄、两边留空）</div>
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
      <div class="input-wrap"><div class="input"><span class="ph">输入密码</span></div></div>
      <div class="submit-wrap"><div class="submit">进 入</div></div>
      <div class="warn">连续错误 5 次将锁定 4 小时</div>
    </div>
  </div>
  <div class="cap good">改动后：包一层 width:100% 的 view<br>按钮和输入框严格同宽（贴住红线）</div>
</div>

</body>
</html>`;

fs.writeFileSync(path.join(OUT, 'submit-wrap-fix.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'submit-wrap-fix.html'));

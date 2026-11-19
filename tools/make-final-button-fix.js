/**
 * 最终效果预览：按钮用 view 实现
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

  .input-wrap { align-self: stretch; margin-top: 40px; }
  .input {
    width: 100%; height: 50px;
    border: 1px solid rgba(240,239,236,.14);
    border-radius: 8px; background: rgba(255,255,255,.02);
    color: #f0efec; font-size: 16px; letter-spacing: .1em;
    text-align: center;
    display: flex; align-items: center; justify-content: center;
  }
  .ph { color: #3d3c3a; font-size: 14px; }

  /* 新方案：view 实现的按钮 */
  .submit {
    align-self: stretch;
    width: 100%;
    height: 50px;
    margin-top: 14px;
    border-radius: 8px;
    border: 1px solid #c9a86a;
    background: rgba(201,168,106,.1);
    color: #c9a86a;
    font-size: 15px;
    letter-spacing: .3em;
    text-indent: .3em;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .warn { margin-top: 14px; font-size: 11px; color: #5a5956; text-align: center; }

  .cap { font-size: 12px; text-align: center; line-height: 1.7; max-width: 350px; color: #7ec99a; }
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
      <div class="submit">进 入</div>
      <div class="warn">连续错误 5 次将锁定 4 小时</div>
    </div>
  </div>
  <div class="cap">按钮改成普通容器后<br>和输入框严格等宽（贴住红线）</div>
</div>
</body>
</html>`;

fs.writeFileSync(path.join(OUT, 'final-button-fix.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'final-button-fix.html'));

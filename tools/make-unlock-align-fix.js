/**
 * 解锁页布局修正预览
 *   · 按钮宽度和输入框一致
 *   · 两者高度都是 100rpx
 *   · 整块内容上移
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
    width: 340px; height: 660px; background: #0d0d0d;
    border-radius: 32px; overflow: hidden;
    box-shadow: 0 0 0 2px rgba(255,255,255,.08), 0 16px 40px rgba(0,0,0,.75);
    display: flex; flex-direction: column;
    position: relative;
  }
  .sbar { height: 44px; flex: 0 0 auto; }
  .nav { padding: 6px 10px; flex: 0 0 auto; }
  .back { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #c8c6c1; padding-bottom: 3px; }

  .content {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 0 44px 110px;
  }
  .content.old { padding: 0 44px 70px; }

  .lock-icon { font-size: 38px; margin-bottom: 20px; opacity: .85; line-height: 1; }
  .album-title {
    font-family: "Songti SC", "SimSun", serif;
    font-size: 24px; letter-spacing: .14em; color: #f0efec; text-align: center;
  }
  .hint { margin-top: 10px; font-size: 13px; letter-spacing: .06em; color: #8a8884; text-align: center; }

  .input-wrap { width: 100%; margin-top: 40px; }
  .input {
    width: 100%; height: 50px;   /* 100rpx */
    border: 1px solid rgba(240,239,236,.14);
    border-radius: 8px; background: rgba(255,255,255,.02);
    color: #f0efec; font-size: 16px;
    letter-spacing: .1em; text-align: center;
    display: flex; align-items: center; justify-content: center;
  }
  .ph { color: #3d3c3a; font-size: 14px; letter-spacing: .06em; }

  /* 新版：和 input 严格同宽同高 */
  .submit {
    display: flex; align-items: center; justify-content: center;
    width: 100%; height: 50px;   /* 100rpx */
    margin: 14px 0 0 0; padding: 0;
    border-radius: 8px; border: 1px solid #c9a86a;
    background: rgba(201,168,106,.1);
    color: #c9a86a; font-size: 15px;
    letter-spacing: .3em; text-indent: .3em;
    line-height: normal;
  }

  /* 旧版：还原 button 默认样式的问题 */
  .submit-old {
    width: 100%; height: 48px;
    margin: 16px auto 0 auto;
    padding: 0 14px;
    border-radius: 8px; border: 1px solid #c9a86a;
    background: rgba(201,168,106,.1);
    color: #c9a86a; font-size: 15px;
    letter-spacing: .3em; text-indent: .3em;
    line-height: 46px; text-align: center;
    /* 模拟按钮比输入框窄 + 偏左 */
    transform: translateX(-6px);
  }

  .warn { margin-top: 24px; font-size: 11px; letter-spacing: .06em; color: #5a5956; text-align: center; }

  /* 标尺线，看对齐 */
  .guide {
    position: absolute; top: 0; bottom: 0; width: 1px;
    background: rgba(217,139,139,.35);
    pointer-events: none;
  }
  .guide.l { left: 44px; }
  .guide.r { right: 44px; }

  .cap { font-size: 12px; color: #888; text-align: center; line-height: 1.7; max-width: 340px; }
  .cap.good { color: #7ec99a; }
  .cap.bad { color: #d98b8b; }
`;

function page(isNew) {
  return `
  <div class="phone">
    <div class="sbar"></div>
    <div class="nav"><div class="back">‹</div></div>
    ${isNew ? '<div class="guide l"></div><div class="guide r"></div>' : ''}
    <div class="content ${isNew ? '' : 'old'}">
      <div class="lock-icon">🔒</div>
      <div class="album-title">人物光影</div>
      <div class="hint">请输入密码后查看</div>
      <div class="input-wrap">
        <div class="input"><span class="ph">输入密码</span></div>
      </div>
      <div class="${isNew ? 'submit' : 'submit-old'}">进 入</div>
      <div class="warn">连续错误 5 次将锁定 4 小时</div>
    </div>
  </div>`;
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8" /><style>${css}</style></head>
<body>

<div class="col">
  ${page(false)}
  <div class="cap bad">改动前：按钮偏窄偏左，高度 48px</div>
</div>

<div class="col">
  ${page(true)}
  <div class="cap good">改动后：按钮和输入框同宽同高（100rpx）<br>整块内容上移，红线是左右边界</div>
</div>

</body>
</html>`;

fs.writeFileSync(path.join(OUT, 'unlock-align-fix.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'unlock-align-fix.html'));

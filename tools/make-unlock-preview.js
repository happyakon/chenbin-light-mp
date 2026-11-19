/**
 * 生成解锁页预览（模拟小程序渲染效果）
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots');
fs.mkdirSync(OUT, { recursive: true });

// 从 wxss 里读关键数值（rpx → px，按 375 宽计算，1rpx = 0.5px）
const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #1a1a1a;
    padding: 40px;
    font-family: -apple-system, "PingFang SC", sans-serif;
    display: flex;
    gap: 40px;
    justify-content: center;
  }

  .phone {
    width: 375px;
    height: 812px;
    background: #0d0d0d;
    border-radius: 40px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 0 0 2px rgba(255,255,255,.1), 0 20px 50px rgba(0,0,0,.8);
  }

  .status-bar { height: 44px; }
  .nav { padding: 6px 10px; }
  .back {
    width: 34px; height: 34px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; color: #c8c6c1; padding-bottom: 3px;
  }

  .content {
    position: absolute;
    left: 0; right: 0; top: 90px; bottom: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 0 44px 70px;
  }

  /* ===== 锁图标区域（改动点 1）===== */
  .lock-badge {
    position: relative;
    width: 100px; height: 100px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 22px;
  }
  .lock-glow {
    position: absolute; left: 50%; top: 50%;
    width: 130px; height: 130px;
    margin-left: -65px; margin-top: -65px;
    border-radius: 50%;
    background: radial-gradient(circle,
      rgba(201,168,106,.16) 0%,
      rgba(201,168,106,.06) 40%,
      rgba(201,168,106,0) 70%);
  }
  .lock-ring {
    position: absolute; left: 50%; top: 50%;
    width: 80px; height: 80px;
    margin-left: -40px; margin-top: -40px;
    border-radius: 50%;
    border: 1px solid rgba(201,168,106,.28);
    background: rgba(201,168,106,.04);
  }
  .lock-icon {
    position: relative;
    font-size: 32px; line-height: 1;
    text-shadow: 0 2px 8px rgba(201,168,106,.35);
  }

  .album-title {
    font-family: "Songti SC", "SimSun", serif;
    font-size: 24px; letter-spacing: .14em;
    color: #f0efec; text-align: center;
  }
  .hint {
    margin-top: 10px; font-size: 13px;
    letter-spacing: .06em; color: #8a8884;
    text-align: center;
  }

  .input-wrap { width: 100%; margin-top: 40px; }
  .input {
    width: 100%; height: 52px;
    border: 1px solid rgba(240,239,236,.14);
    border-radius: 8px;
    background: rgba(255,255,255,.02);
    color: #f0efec; font-size: 16px;
    letter-spacing: .1em; text-align: center;
    display: flex; align-items: center; justify-content: center;
  }
  .input-ph { color: #3d3c3a; font-size: 14px; }

  /* ===== 按钮（改动点 2：居中）===== */
  .submit {
    width: 100%;
    height: 50px;
    margin: 16px 0 0 0;   /* 关键：左右 margin 为 0 */
    padding: 0;
    border-radius: 8px;
    border: 1px solid #c9a86a;
    background: rgba(201,168,106,.1);
    color: #c9a86a;
    font-size: 15px;
    letter-spacing: .3em;
    text-indent: .3em;
    display: flex; align-items: center; justify-content: center;
  }

  .warn {
    margin-top: 24px; font-size: 11px;
    letter-spacing: .06em; color: #5a5956;
    text-align: center; line-height: 1.7;
  }

  .label {
    position: absolute; bottom: 20px; left: 0; right: 0;
    text-align: center; font-size: 12px; color: #666;
  }
</style>
</head>
<body>

<!-- 改动后 -->
<div style="display:flex;flex-direction:column;align-items:center;gap:12px">
  <div class="phone">
    <div class="status-bar"></div>
    <div class="nav"><div class="back">‹</div></div>
    <div class="content">
      <div class="lock-badge">
        <div class="lock-glow"></div>
        <div class="lock-ring"></div>
        <div class="lock-icon">🔒</div>
      </div>
      <div class="album-title">人物光影</div>
      <div class="hint">请输入密码后查看</div>
      <div class="input-wrap">
        <div class="input"><span class="input-ph">输入密码</span></div>
      </div>
      <div class="submit">进 入</div>
      <div class="warn">连续错误 5 次将锁定 4 小时</div>
    </div>
    <div class="label">改动后</div>
  </div>
</div>

<!-- 改动前（对比） -->
<div style="display:flex;flex-direction:column;align-items:center;gap:12px">
  <div class="phone">
    <div class="status-bar"></div>
    <div class="nav"><div class="back">‹</div></div>
    <div class="content">
      <div style="font-size:38px;margin-bottom:20px;opacity:.85;line-height:1">🔒</div>
      <div class="album-title">人物光影</div>
      <div class="hint">请输入密码后查看</div>
      <div class="input-wrap">
        <div class="input"><span class="input-ph">输入密码</span></div>
      </div>
      <!-- 模拟 button 默认 auto margin 造成的偏移 -->
      <div class="submit" style="width:calc(100% - 14px);margin-left:auto;margin-right:auto;transform:translateX(-7px)">进 入</div>
      <div class="warn">连续错误 5 次将锁定 4 小时</div>
    </div>
    <div class="label">改动前（按钮偏移、锁图标单薄）</div>
  </div>
</div>

</body>
</html>`;

const file = path.join(OUT, 'unlock-fix-preview.html');
fs.writeFileSync(file, html, 'utf8');
console.log('生成:', file);

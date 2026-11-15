/**
 * 用真实的小程序 WXSS 渲染 HTML，验证视觉效果
 *
 * 这个脚本把 index.wxss 里的样式直接拿过来用，
 * 只是把 rpx 换算成 px（rpx = 屏宽/750，390 宽屏幕下 1rpx ≈ 0.52px）
 */
const fs = require('fs');
const path = require('path');

const MP = path.join(__dirname, '..', 'miniprogram');
const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots', 'mp-proto');

// 读真实的小程序样式
let wxss = fs.readFileSync(path.join(MP, 'pages', 'index', 'index.wxss'), 'utf8');

// rpx → px（390 宽屏，1rpx = 390/750 = 0.52px）
wxss = wxss.replace(/(\d+(?:\.\d+)?)rpx/g, (m, n) => `${(parseFloat(n) * 0.52).toFixed(2)}px`);

// page 选择器换成 body
wxss = wxss.replace(/^page\s*\{/gm, 'body {');

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>首页 · 真实样式渲染</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #030303;
    padding: 40px;
    font-family: -apple-system, "PingFang SC", "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .stage {
    display: flex;
    gap: 50px;
    justify-content: center;
    align-items: flex-start;
  }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .cap { text-align: center; max-width: 340px; }
  .cap b { display: block; font-size: 13px; color: #c8c6c1; font-weight: 400; margin-bottom: 6px; }
  .cap span { font-size: 11px; color: #5a5956; line-height: 1.7; }

  /* 手机外壳 */
  .phone {
    width: 390px; height: 844px; background: #000;
    border-radius: 46px; padding: 10px;
    box-shadow: 0 0 0 1.5px rgba(255,255,255,0.12), 0 24px 70px rgba(0,0,0,0.9);
    position: relative;
  }
  .screen {
    width: 100%; height: 100%; background: #070707;
    border-radius: 38px; overflow: hidden; position: relative;
  }

  /* ============ 以下是真实的小程序 WXSS ============ */
${wxss}
  /* ================================================= */

  /* 不改 .index-page 的定位，保持小程序里的 position:fixed 行为 */

  /* 模拟状态栏 */
  .fake-status {
    position: absolute; top: 0; left: 0; right: 0; height: 48px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 26px 0 32px; font-size: 14px; font-weight: 600;
    color: #f0efec; z-index: 40;
  }

  .doc {
    max-width: 900px; margin: 0 auto 40px;
  }
  .doc h1 { font-family: "Songti SC", serif; font-size: 26px; letter-spacing: 0.14em; color: #f0efec; font-weight: 400; }
  .doc p { margin-top: 12px; font-size: 13px; line-height: 1.9; color: #8a8884; }
</style>
</head>
<body>

<div class="doc">
  <h1>首页 · 真实样式渲染</h1>
  <p>这个预览直接用小程序里的 index.wxss，把 rpx 换算成 px。左图是动画播放中，右图是播完的稳定状态。</p>
</div>

<div class="stage">

  <!-- 播放中 -->
  <div class="wrap">
    <div class="phone"><div class="screen">
      <div class="fake-status">
        <span>14:45</span>
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
      </div>

      <div class="index-page is-animating">
        <div class="status-bar" style="height:44px"></div>

        <div class="glow glow-1"></div>
        <div class="glow glow-2"></div>
        <div class="glow glow-3"></div>

        <div class="particles">
          <div class="particle" style="left:8%;top:72%;width:2.5px;height:2.5px;animation-duration:19s;animation-delay:0s"></div>
          <div class="particle" style="left:18%;top:88%;width:2px;height:2px;animation-duration:23s;animation-delay:2.4s"></div>
          <div class="particle" style="left:27%;top:64%;width:3px;height:3px;animation-duration:16s;animation-delay:5.1s"></div>
          <div class="particle" style="left:35%;top:92%;width:1.8px;height:1.8px;animation-duration:25s;animation-delay:1.2s"></div>
          <div class="particle" style="left:44%;top:78%;width:2.6px;height:2.6px;animation-duration:18s;animation-delay:7.3s"></div>
          <div class="particle" style="left:52%;top:85%;width:2.2px;height:2.2px;animation-duration:21s;animation-delay:3.6s"></div>
          <div class="particle" style="left:61%;top:70%;width:2.8px;height:2.8px;animation-duration:17s;animation-delay:9.0s"></div>
          <div class="particle" style="left:69%;top:94%;width:1.6px;height:1.6px;animation-duration:26s;animation-delay:4.5s"></div>
          <div class="particle" style="left:78%;top:76%;width:2.4px;height:2.4px;animation-duration:20s;animation-delay:6.8s"></div>
          <div class="particle" style="left:86%;top:89%;width:2px;height:2px;animation-duration:22s;animation-delay:2.0s"></div>
        </div>

        <div class="welcome">
<view class="welcome-main">欢迎来到我的拾光集</view>
<view class="welcome-line"></view>
</view>

<div class="poems">
          <div class="poem-row">
            <view class="pchar pchar-1" style="animation-delay:0.30s">光</view>
            <view class="pchar pchar-1" style="animation-delay:0.41s">是</view>
            <view class="pchar pchar-1" style="animation-delay:0.52s">时</view>
            <view class="pchar pchar-1" style="animation-delay:0.63s">间</view>
            <view class="pchar pchar-1" style="animation-delay:0.74s">的</view>
            <view class="pchar pchar-1" style="animation-delay:0.85s">形</view>
            <view class="pchar pchar-1" style="animation-delay:0.96s">状</view>
          </div>
          <div class="poem-row poem-row-2">
            <view class="pchar pchar-2" style="animation-delay:1.15s">我</view>
            <view class="pchar pchar-2" style="animation-delay:1.26s">只</view>
            <view class="pchar pchar-2" style="animation-delay:1.37s">负</view>
            <view class="pchar pchar-2" style="animation-delay:1.48s">责</view>
            <view class="pchar pchar-2" style="animation-delay:1.59s">记</view>
            <view class="pchar pchar-2" style="animation-delay:1.70s">下</view>
          </div>
        </div>

        <div class="sig">
          <div class="sig-line"></div>
          <div class="sig-name">
            <view class="nchar" style="animation-delay:1.95s">陈</view>
            <view class="nchar" style="animation-delay:2.11s">彬</view>
          </div>
          <div class="sig-sub">摄影师 · 记录者</div>
        </div>

        <div class="enter is-on">
          <div class="enter-text">轻触进入</div>
          <div class="enter-arrow">↓</div>
        </div>
      </div>
    </div></div>
    <div class="cap"><b>动画播放中</b><span>文字逐字浮现</span></div>
  </div>

  <!-- 稳定状态 -->
  <div class="wrap">
    <div class="phone"><div class="screen">
      <div class="fake-status">
        <span>14:48</span>
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
      </div>

      <div class="index-page">
        <div class="status-bar" style="height:44px"></div>

        <div class="glow glow-1"></div>
        <div class="glow glow-2"></div>
        <div class="glow glow-3"></div>

        <div class="particles">
          <div class="particle" style="left:8%;top:72%;width:2.5px;height:2.5px;animation-duration:19s;animation-delay:0s"></div>
          <div class="particle" style="left:18%;top:88%;width:2px;height:2px;animation-duration:23s;animation-delay:2.4s"></div>
          <div class="particle" style="left:27%;top:64%;width:3px;height:3px;animation-duration:16s;animation-delay:5.1s"></div>
          <div class="particle" style="left:35%;top:92%;width:1.8px;height:1.8px;animation-duration:25s;animation-delay:1.2s"></div>
          <div class="particle" style="left:44%;top:78%;width:2.6px;height:2.6px;animation-duration:18s;animation-delay:7.3s"></div>
          <div class="particle" style="left:52%;top:85%;width:2.2px;height:2.2px;animation-duration:21s;animation-delay:3.6s"></div>
          <div class="particle" style="left:61%;top:70%;width:2.8px;height:2.8px;animation-duration:17s;animation-delay:9.0s"></div>
          <div class="particle" style="left:69%;top:94%;width:1.6px;height:1.6px;animation-duration:26s;animation-delay:4.5s"></div>
          <div class="particle" style="left:78%;top:76%;width:2.4px;height:2.4px;animation-duration:20s;animation-delay:6.8s"></div>
          <div class="particle" style="left:86%;top:89%;width:2px;height:2px;animation-duration:22s;animation-delay:2.0s"></div>
        </div>

        <div class="welcome">
<view class="welcome-main">欢迎来到我的拾光集</view>
<view class="welcome-line"></view>
</view>

<div class="poems">
          <div class="poem-row">
            <view class="pchar pchar-1">光</view>
            <view class="pchar pchar-1">是</view>
            <view class="pchar pchar-1">时</view>
            <view class="pchar pchar-1">间</view>
            <view class="pchar pchar-1">的</view>
            <view class="pchar pchar-1">形</view>
            <view class="pchar pchar-1">状</view>
          </div>
          <div class="poem-row poem-row-2">
            <view class="pchar pchar-2">我</view>
            <view class="pchar pchar-2">只</view>
            <view class="pchar pchar-2">负</view>
            <view class="pchar pchar-2">责</view>
            <view class="pchar pchar-2">记</view>
            <view class="pchar pchar-2">下</view>
          </div>
        </div>

        <div class="sig">
          <div class="sig-line"></div>
          <div class="sig-name">
            <view class="nchar">陈</view>
            <view class="nchar">彬</view>
          </div>
          <div class="sig-sub">摄影师 · 记录者</div>
        </div>

        <div class="enter is-on">
          <div class="enter-text">轻触进入</div>
          <div class="enter-arrow">↓</div>
        </div>
      </div>
    </div></div>
    <div class="cap"><b>稳定状态</b><span>所有元素可见，光晕和光点持续流动</span></div>
  </div>

</div>

</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'home-real.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'home-real.html'));
console.log('（用的是真实 index.wxss，rpx 已换算）');

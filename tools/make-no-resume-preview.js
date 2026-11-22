/**
 * 前后对比：断点续看提示条
 */
const fs = require('fs');
const path = require('path');

const OUT = 'D:/workspace/chenbin-light/shots';
fs.mkdirSync(OUT, { recursive: true });

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #141414; padding: 28px;
    font-family: -apple-system, "PingFang SC", sans-serif;
    display: flex; gap: 36px; justify-content: center; align-items: flex-start;
  }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .label { font-size: 11.5px; text-align: center; line-height: 1.7; }
  .label.bad { color: #d98b8b; }
  .label.good { color: #7ec99a; }

  .phone {
    width: 360px; background: #0d0d0d;
    border-radius: 26px; overflow: hidden;
    box-shadow: 0 0 0 2px rgba(255,255,255,.07), 0 14px 36px rgba(0,0,0,.7);
  }

  /* 头部大图 */
  .hero {
    position: relative; height: 210px;
    background: linear-gradient(160deg, #c8a89a, #8f6f66 60%, #5a4640);
  }
  .hero:after {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,.7), transparent 60%);
  }
  .hero-text { position: absolute; left: 20px; bottom: 18px; z-index: 2; }
  .hero-title {
    font-family: "Songti SC", serif; font-size: 25px;
    color: #fff; letter-spacing: .08em;
  }
  .hero-count { font-size: 12px; color: rgba(255,255,255,.6); margin-top: 5px; }

  /* 断点续看提示条 */
  .resume-tip {
    display: flex; align-items: center; gap: 7px;
    margin: 12px 12px 0; padding: 9px 11px;
    border-radius: 7px;
    background: rgba(201,168,106,.1);
    border: 1px solid rgba(201,168,106,.24);
  }
  .rt-text { flex: 1; font-size: 11.5px; letter-spacing: .04em; color: #c9a86a; }
  .rt-btn {
    flex: 0 0 auto; padding: 4.5px 11px; border-radius: 9px;
    background: rgba(201,168,106,.2);
    border: 1px solid rgba(201,168,106,.38);
    font-size: 11px; color: #c9a86a;
  }
  .rt-close {
    flex: 0 0 auto; width: 20px; height: 20px;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; color: #7a7873;
  }

  /* 瀑布流 */
  .grid { display: flex; gap: 4px; padding: 8px; }
  .m-col { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .tile { border-radius: 3px; width: 100%; }
  .t1 { background: linear-gradient(150deg,#b5a89e,#6e6259); }
  .t2 { background: linear-gradient(150deg,#9aa8b0,#5d6a72); }
  .t3 { background: linear-gradient(150deg,#c4b49a,#87775f); }
  .t4 { background: linear-gradient(150deg,#a8b0a0,#68705f); }

  .statusbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 16px; font-size: 12px; color: #fff;
  }
`;

function phone(withTip) {
  return `
  <div class="phone">
    <div class="hero">
      <div class="statusbar"><span>23:16</span><span>•••</span></div>
      <div class="hero-text">
        <div class="hero-title">童年纪事</div>
        <div class="hero-count">29 张图片</div>
      </div>
    </div>

    ${withTip ? `
    <div class="resume-tip">
      <span class="rt-text">上次看到第 26 张</span>
      <span class="rt-btn">继续看</span>
      <span class="rt-close">×</span>
    </div>` : ''}

    <div class="grid">
      <div class="m-col">
        <div class="tile t1" style="aspect-ratio:3/4"></div>
        <div class="tile t2" style="aspect-ratio:1/1"></div>
        <div class="tile t3" style="aspect-ratio:4/3"></div>
        <div class="tile t4" style="aspect-ratio:3/4"></div>
      </div>
      <div class="m-col">
        <div class="tile t2" style="aspect-ratio:4/3"></div>
        <div class="tile t4" style="aspect-ratio:3/4"></div>
        <div class="tile t1" style="aspect-ratio:1/1"></div>
        <div class="tile t3" style="aspect-ratio:3/4"></div>
      </div>
      <div class="m-col">
        <div class="tile t3" style="aspect-ratio:1/1"></div>
        <div class="tile t1" style="aspect-ratio:3/4"></div>
        <div class="tile t2" style="aspect-ratio:4/3"></div>
        <div class="tile t4" style="aspect-ratio:3/4"></div>
      </div>
    </div>
  </div>`;
}

const html = `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><style>${css}</style></head><body>

<div class="wrap">
  ${phone(true)}
  <div class="label bad">改动前<br>有一条「上次看到第 26 张」提示</div>
</div>

<div class="wrap">
  ${phone(false)}
  <div class="label good">改动后<br>提示条已移除，直接进照片墙</div>
</div>

</body></html>`;

fs.writeFileSync(path.join(OUT, 'no-resume-preview.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'no-resume-preview.html'));

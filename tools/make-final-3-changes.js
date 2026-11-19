/**
 * 三项改动最终预览
 *   1. 解锁页：线框锁 + PRIVATE GALLERY
 *   2. 解锁页背景：还原纯色
 *   3. 卡片英文标题：金色
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots');
fs.mkdirSync(OUT, { recursive: true });

const LOCK =
  'data:image/svg+xml;base64,' +
  'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA1NiIg' +
  'ZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYzlhODZhIiBzdHJva2Utd2lkdGg9IjEuNiIgc3Ryb2tlLWxpbmVj' +
  'YXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cmVjdCB4PSI0IiB5PSIyNCIgd2lk' +
  'dGg9IjQwIiBoZWlnaHQ9IjI4IiByeD0iNCIvPgogIDxwYXRoIGQ9Ik0xMyAyNFYxNGExMSAxMSAwIDAg' +
  'MSAyMiAwdjEwIi8+CiAgPGNpcmNsZSBjeD0iMjQiIGN5PSIzNyIgcj0iMyIvPgogIDxwYXRoIGQ9Ik0y' +
  'NCA0MHY1Ii8+Cjwvc3ZnPg==';

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #141414; padding: 36px;
    font-family: -apple-system, "PingFang SC", sans-serif;
    display: flex; gap: 40px; justify-content: center; align-items: flex-start;
  }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; }

  .phone {
    width: 340px; height: 680px; background: #0d0d0d;
    border-radius: 32px; overflow: hidden; position: relative;
    box-shadow: 0 0 0 2px rgba(255,255,255,.08), 0 16px 40px rgba(0,0,0,.75);
    display: flex; flex-direction: column;
  }
  .sbar { height: 44px; flex: 0 0 auto; }
  .nav { padding: 6px 10px; flex: 0 0 auto; }
  .back { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #c8c6c1; padding-bottom: 3px; }

  .content {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 0 44px 70px;
  }

  /* 锁标记 */
  .lock-mark { display: flex; flex-direction: column; align-items: center; margin-bottom: 28px; }
  .lock-svg { width: 48px; height: 56px; display: block; }
  .lock-en {
    margin-top: 13px;
    font-size: 10px;
    letter-spacing: .42em;
    text-indent: .42em;
    color: rgba(201,168,106,.85);
    text-transform: uppercase;
  }

  .album-title {
    font-family: "Songti SC", "SimSun", serif;
    font-size: 24px; letter-spacing: .14em;
    color: #f0efec; text-align: center;
  }
  .hint {
    margin-top: 10px; font-size: 13px;
    letter-spacing: .06em; color: #8a8884; text-align: center;
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
  .ph { color: #3d3c3a; font-size: 14px; letter-spacing: .06em; }

  .submit {
    width: 100%; height: 50px; margin: 16px 0 0 0; padding: 0;
    border-radius: 8px;
    border: 1px solid #c9a86a;
    background: rgba(201,168,106,.1);
    color: #c9a86a; font-size: 15px;
    letter-spacing: .3em; text-indent: .3em;
    display: flex; align-items: center; justify-content: center;
  }

  .warn {
    margin-top: 24px; font-size: 11px;
    letter-spacing: .06em; color: #5a5956;
    text-align: center;
  }

  /* ---- 卡片对比（英文改金色） ---- */
  .cards { display: flex; gap: 12px; }
  .card { width: 148px; }
  .cwrap {
    position: relative; width: 100%; aspect-ratio: 3/4;
    border-radius: 4px; overflow: hidden;
    background: #141414;
    box-shadow: 0 3px 14px rgba(0,0,0,.5);
  }
  .cwrap img { width: 100%; height: 100%; object-fit: cover; display: block; opacity: .72; }
  .shade {
    position: absolute; left: 0; right: 0; bottom: 0; height: 55%;
    background: linear-gradient(to top, rgba(0,0,0,.85), transparent);
    z-index: 1;
  }
  .ctext { position: absolute; left: 0; right: 0; bottom: 0; padding: 12px 10px 10px; z-index: 2; }
  .cn {
    font-family: "Songti SC", "SimSun", serif;
    font-size: 14px; letter-spacing: .08em; color: #f0efec;
  }
  .en-old {
    margin-top: 4px; font-size: 8px;
    letter-spacing: .18em;
    color: rgba(255,255,255,.55);
    text-transform: uppercase;
  }
  .en-new {
    margin-top: 4px; font-size: 8px;
    letter-spacing: .18em;
    color: rgba(201,168,106,.85);
    text-transform: uppercase;
  }
  .badge {
    position: absolute; top: 7px; right: 7px;
    width: 22px; height: 22px; border-radius: 50%;
    background: rgba(0,0,0,.6);
    border: 1px solid rgba(201,168,106,.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; z-index: 3;
  }

  .cap { font-size: 12px; color: #888; text-align: center; max-width: 340px; line-height: 1.7; }
  .cap.good { color: #7ec99a; }
`;

/* 找一张图做卡片背景 */
const imgDir = path.join(
  __dirname, '..', '..', 'chenbin-light', 'photos', 'portrait', 'people'
);
let imgB64 = '';
try {
  const sharp = require('D:/workspace/chenbin-light/node_modules/sharp');
  const files = fs.readdirSync(imgDir).filter((f) => /\.jpe?g$/i.test(f));
  if (files.length) {
    const buf = sharp(path.join(imgDir, files[0]))
      .rotate()
      .resize({ width: 400, withoutEnlargement: true })
      .blur(10)
      .jpeg({ quality: 70 })
      .toBuffer();
    imgB64 = buf.toString('base64');
  }
} catch (_) {}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8" /><style>${css}</style></head>
<body>

<!-- 解锁页 -->
<div class="wrap">
  <div class="phone">
    <div class="sbar"></div>
    <div class="nav"><div class="back">‹</div></div>
    <div class="content">
      <div class="lock-mark">
        <img class="lock-svg" src="${LOCK}" />
        <div class="lock-en">Private Gallery</div>
      </div>
      <div class="album-title">人物光影</div>
      <div class="hint">请输入密码后查看</div>
      <div class="input-wrap">
        <div class="input"><span class="ph">输入密码</span></div>
      </div>
      <div class="submit">进 入</div>
      <div class="warn">连续错误 5 次将锁定 4 小时</div>
    </div>
  </div>
  <div class="cap good">改动后：线框锁 + PRIVATE GALLERY<br>背景还原成纯色</div>
</div>

<!-- 卡片英文颜色对比 -->
<div class="wrap">
  <div class="cards">
    <div class="card">
      <div class="cwrap">
        ${imgB64 ? `<img src="data:image/jpeg;base64,${imgB64}" />` : ''}
        <div class="shade"></div>
        <div class="badge">🔒</div>
        <div class="ctext">
          <div class="cn">人物光影</div>
          <div class="en-old">Portraits</div>
        </div>
      </div>
      <div class="cap" style="margin-top:8px">改动前：白色</div>
    </div>

    <div class="card">
      <div class="cwrap">
        ${imgB64 ? `<img src="data:image/jpeg;base64,${imgB64}" />` : ''}
        <div class="shade"></div>
        <div class="badge">🔒</div>
        <div class="ctext">
          <div class="cn">人物光影</div>
          <div class="en-new">Portraits</div>
        </div>
      </div>
      <div class="cap" style="margin-top:8px">改动后：金色</div>
    </div>
  </div>
  <div class="cap good" style="margin-top:10px">卡片英文标题改成金色，和 PC 端一致</div>
</div>

</body>
</html>`;

const file = path.join(OUT, 'final-3-changes.html');
fs.writeFileSync(file, html, 'utf8');
console.log('生成:', file);

/**
 * 解锁页恢复 emoji，卡片保持线框锁 —— 最终对比
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots');
fs.mkdirSync(OUT, { recursive: true });

const LOCK_SMALL =
  'data:image/svg+xml;base64,' +
  'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyOCIg' +
  'ZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYzlhODZhIiBzdHJva2Utd2lkdGg9IjEuOCIgc3Ryb2tlLWxpbmVj' +
  'YXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cmVjdCB4PSIzIiB5PSIxMiIgd2lk' +
  'dGg9IjE4IiBoZWlnaHQ9IjEzIiByeD0iMi41Ii8+CiAgPHBhdGggZD0iTTcuNSAxMlY3LjVhNC41IDQu' +
  'NSAwIDAgMSA5IDBWMTIiLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjE4IiByPSIxLjQiLz4KICA8cGF0' +
  'aCBkPSJNMTIgMTkuNHYyLjIiLz4KPC9zdmc+';

let imgB64 = '';
try {
  const sharp = require('D:/workspace/chenbin-light/node_modules/sharp');
  const dir = path.join(
    __dirname, '..', '..', 'chenbin-light', 'photos', 'portrait', 'people'
  );
  const files = fs.readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f));
  if (files.length) {
    imgB64 = sharp(path.join(dir, files[0]))
      .rotate()
      .resize({ width: 400, withoutEnlargement: true })
      .blur(10)
      .jpeg({ quality: 70 })
      .toBuffer()
      .toString('base64');
  }
} catch (e) {}

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #141414; padding: 34px;
    font-family: -apple-system, "PingFang SC", sans-serif;
    display: flex; gap: 44px; justify-content: center; align-items: flex-start;
  }
  .col { display: flex; flex-direction: column; align-items: center; gap: 12px; }

  /* ---------- 解锁页 ---------- */
  .phone {
    width: 320px; height: 620px; background: #0d0d0d;
    border-radius: 30px; overflow: hidden;
    box-shadow: 0 0 0 2px rgba(255,255,255,.08), 0 16px 40px rgba(0,0,0,.75);
    display: flex; flex-direction: column;
  }
  .sbar { height: 40px; flex: 0 0 auto; }
  .nav { padding: 6px 10px; flex: 0 0 auto; }
  .back { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 21px; color: #c8c6c1; padding-bottom: 3px; }

  .content {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 0 40px 64px;
  }
  .lock-icon { font-size: 38px; margin-bottom: 20px; opacity: .85; line-height: 1; }

  .album-title {
    font-family: "Songti SC", "SimSun", serif;
    font-size: 23px; letter-spacing: .14em; color: #f0efec; text-align: center;
  }
  .hint { margin-top: 10px; font-size: 12.5px; letter-spacing: .06em; color: #8a8884; text-align: center; }

  .input-wrap { width: 100%; margin-top: 38px; }
  .input {
    width: 100%; height: 50px;
    border: 1px solid rgba(240,239,236,.14);
    border-radius: 8px; background: rgba(255,255,255,.02);
    color: #f0efec; font-size: 15px;
    letter-spacing: .1em; text-align: center;
    display: flex; align-items: center; justify-content: center;
  }
  .ph { color: #3d3c3a; font-size: 13.5px; letter-spacing: .06em; }

  .submit {
    width: 100%; height: 48px; margin: 15px 0 0 0; padding: 0;
    border-radius: 8px; border: 1px solid #c9a86a;
    background: rgba(201,168,106,.1);
    color: #c9a86a; font-size: 14px;
    letter-spacing: .3em; text-indent: .3em;
    display: flex; align-items: center; justify-content: center;
  }
  .warn { margin-top: 22px; font-size: 10.5px; letter-spacing: .06em; color: #5a5956; text-align: center; }

  /* ---------- 卡片 ---------- */
  .card { width: 160px; }
  .cwrap {
    position: relative; width: 100%; aspect-ratio: 3/4;
    border-radius: 4px; overflow: hidden;
    background: #141414;
    box-shadow: 0 3px 14px rgba(0,0,0,.5);
  }
  .cwrap img.bg { width: 100%; height: 100%; object-fit: cover; display: block; opacity: .72; }
  .shade {
    position: absolute; left: 0; right: 0; bottom: 0; height: 55%;
    background: linear-gradient(to top, rgba(0,0,0,.85), transparent);
    z-index: 1;
  }
  .lock-overlay {
    position: absolute; left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    display: flex; flex-direction: column; align-items: center;
    z-index: 2;
  }
  .lock-overlay-svg { width: 22px; height: 26px; display: block; }
  .lock-overlay-text {
    margin-top: 6px; font-size: 8px;
    letter-spacing: .2em; text-indent: .2em;
    color: rgba(201,168,106,.9);
    text-transform: uppercase; white-space: nowrap;
  }
  .badge {
    position: absolute; top: 7px; right: 7px;
    width: 22px; height: 22px; border-radius: 50%;
    background: rgba(0,0,0,.6);
    border: 1px solid rgba(201,168,106,.25);
    display: flex; align-items: center; justify-content: center;
    z-index: 3;
  }
  .badge-lock { width: 10px; height: 12px; display: block; }
  .need-pass {
    position: absolute; right: 6px; bottom: 6px;
    padding: 2px 6px; border-radius: 10px;
    border: 1px solid rgba(201,168,106,.42);
    background: rgba(0,0,0,.55);
    font-size: 8.5px; letter-spacing: .06em;
    color: rgba(201,168,106,.9);
    z-index: 3;
  }
  .ctext { position: absolute; left: 0; right: 0; bottom: 0; padding: 11px 9px 9px; z-index: 2; }
  .cn {
    font-family: "Songti SC", "SimSun", serif;
    font-size: 13px; letter-spacing: .08em; color: #f0efec;
  }
  .en {
    margin-top: 4px; font-size: 7.5px; letter-spacing: .18em;
    color: rgba(201,168,106,.85); text-transform: uppercase;
  }
  .count { margin-top: 6px; font-size: 10.5px; letter-spacing: .06em; color: #5a5956; }

  .cap { font-size: 12px; color: #888; text-align: center; line-height: 1.7; max-width: 320px; }
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
      <div class="lock-icon">🔒</div>
      <div class="album-title">人物光影</div>
      <div class="hint">请输入密码后查看</div>
      <div class="input-wrap">
        <div class="input"><span class="ph">输入密码</span></div>
      </div>
      <div class="submit">进 入</div>
      <div class="warn">连续错误 5 次将锁定 4 小时</div>
    </div>
  </div>
  <div class="cap good">解锁页：恢复成 emoji 锁</div>
</div>

<div class="col">
  <div class="card">
    <div class="cwrap">
      ${imgB64 ? `<img class="bg" src="data:image/jpeg;base64,${imgB64}" />` : ''}
      <div class="shade"></div>
      <div class="lock-overlay">
        <img class="lock-overlay-svg" src="${LOCK_SMALL}" />
        <div class="lock-overlay-text">Private Gallery</div>
      </div>
      <div class="badge"><img class="badge-lock" src="${LOCK_SMALL}" /></div>
      <div class="need-pass">需要密码</div>
      <div class="ctext">
        <div class="cn">人物光影</div>
        <div class="en">Portraits</div>
      </div>
    </div>
    <div class="count">28 张</div>
  </div>
  <div class="cap good">卡片：保持线框锁（中间 + 角上）</div>
</div>

</body>
</html>`;

fs.writeFileSync(path.join(OUT, 'unlock-revert-preview.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'unlock-revert-preview.html'));

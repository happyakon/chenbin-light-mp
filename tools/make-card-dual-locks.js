/**
 * 卡片双锁效果预览（中间大锁 + 角上小锁）
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
    background: #0d0d0d; padding: 36px;
    font-family: -apple-system, "PingFang SC", sans-serif;
    display: flex; gap: 16px; justify-content: center;
  }
  /* 模拟真实的两列网格宽度 */
  .card { width: 172px; }
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

  /* 中间叠加 */
  .lock-overlay {
    position: absolute; left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    display: flex; flex-direction: column; align-items: center;
    z-index: 2;
  }
  .lock-overlay-svg { width: 24px; height: 28px; display: block; }
  .lock-overlay-text {
    margin-top: 7px; font-size: 8.5px;
    letter-spacing: .2em; text-indent: .2em;
    color: rgba(201,168,106,.9);
    text-transform: uppercase; white-space: nowrap;
  }

  /* 右上角徽章 */
  .badge {
    position: absolute; top: 8px; right: 8px;
    width: 24px; height: 24px; border-radius: 50%;
    background: rgba(0,0,0,.6);
    border: 1px solid rgba(201,168,106,.25);
    display: flex; align-items: center; justify-content: center;
    z-index: 3;
  }
  .badge-lock { width: 11px; height: 13px; display: block; }

  .need-pass {
    position: absolute; right: 6px; bottom: 6px;
    padding: 2px 6px; border-radius: 10px;
    border: 1px solid rgba(201,168,106,.42);
    background: rgba(0,0,0,.55);
    font-size: 9px; letter-spacing: .06em;
    color: rgba(201,168,106,.9);
    z-index: 3;
  }

  .ctext {
    position: absolute; left: 0; right: 0; bottom: 0;
    padding: 12px 10px 10px; z-index: 2;
  }
  .cn {
    font-family: "Songti SC", "SimSun", serif;
    font-size: 14px; letter-spacing: .08em; color: #f0efec;
  }
  .en {
    margin-top: 4px; font-size: 8px; letter-spacing: .18em;
    color: rgba(201,168,106,.85); text-transform: uppercase;
  }
  .count { margin-top: 6px; font-size: 11px; letter-spacing: .06em; color: #5a5956; }
  .cap { font-size: 11px; color: #7ec99a; text-align: center; margin-top: 10px; line-height: 1.7; }
`;

function card() {
  return `
  <div class="card">
    <div class="cwrap">
      ${imgB64 ? `<img class="bg" src="data:image/jpeg;base64,${imgB64}" />` : ''}
      <div class="shade"></div>

      <div class="lock-overlay">
        <img class="lock-overlay-svg" src="${LOCK_SMALL}" />
        <div class="lock-overlay-text">Private Gallery</div>
      </div>

      <div class="badge">
        <img class="badge-lock" src="${LOCK_SMALL}" />
      </div>

      <div class="need-pass">需要密码</div>

      <div class="ctext">
        <div class="cn">人物光影</div>
        <div class="en">Portraits</div>
      </div>
    </div>
    <div class="count">28 张</div>
  </div>`;
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8" /><style>${css}</style></head>
<body>
<div>
  ${card()}
  <div class="cap">中间大锁 + 角上小锁<br>都是金色线框</div>
</div>
<div>
  ${card()}
  <div class="cap">相邻两列的间距效果</div>
</div>
</body>
</html>`;

fs.writeFileSync(path.join(OUT, 'card-dual-locks.html'), html, 'utf8');
console.log('生成:', path.join(OUT, 'card-dual-locks.html'));

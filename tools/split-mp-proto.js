/**
 * 把原型图按页面拆成单张截图，每个页面一张大图。
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const FILE = path.resolve(__dirname, '..', 'shots', 'mp-proto', 'index.html');
const OUTDIR = path.resolve(__dirname, '..', 'shots', 'mp-proto');
const CDP = 9200 + Math.floor(Math.random() * 20);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cbl-pp-'));
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    `--remote-debugging-port=${CDP}`, '--user-data-dir=' + dir,
    '--window-size=1900,2200', 'about:blank',
  ], { stdio: 'ignore' });

  let target = null;
  for (let i = 0; i < 90; i += 1) {
    try {
      const l = await (await fetch(`http://127.0.0.1:${CDP}/json/list`)).json();
      target = l.find((t) => t.type === 'page');
      if (target) break;
    } catch (_) {}
    await sleep(150);
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id);
      pending.delete(m.id);
      m.error ? reject(new Error(m.error.message)) : resolve(m.result);
    }
  });
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  const send = (method, params) =>
    new Promise((res, rej) => {
      id += 1;
      pending.set(id, { resolve: res, reject: rej });
      ws.send(JSON.stringify({ id, method, params: params || {} }));
    });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1900, height: 2200, deviceScaleFactor: 2, mobile: false,
  });
  await send('Page.navigate', { url: 'file:///' + FILE.replace(/\\/g, '/') + '?t=' + Date.now() });
  await sleep(3000);

  // 拿到每个 .screen-wrap 的位置和标题
  const listRes = await send('Runtime.evaluate', {
    expression: `JSON.stringify(
      [...document.querySelectorAll('.screen-wrap')].map((w, i) => {
        const r = w.getBoundingClientRect();
        const cap = w.querySelector('.screen-cap b');
        return {
          i,
          name: cap ? cap.textContent : 'screen' + i,
          x: Math.round(r.left),
          y: Math.round(r.top) + window.scrollY,
          w: Math.round(r.width),
          h: Math.round(r.height)
        };
      })
    )`,
    returnByValue: true,
  });

  let screens = [];
  try { screens = JSON.parse(listRes.result.value); } catch (_) {
    console.log('获取位置失败');
    ws.close(); chrome.kill();
    return;
  }

  const names = ['index', 'album', 'album-exif', 'unlock', 'mine', 'favorites'];

  for (const s of screens) {
    const fname = (names[s.i] || 'screen' + s.i) + '.png';
    // 裁剪：手机宽度 390 + padding，稍微留点边
    const clip = {
      x: s.x + (s.w - 390) / 2 - 6,
      y: s.y - 4,
      width: 402,
      height: 844 + 20 + 70,  // 手机 + 上下留白 + 说明文字
      scale: 2,
    };
    const shot = await send('Page.captureScreenshot', { format: 'png', clip });
    fs.writeFileSync(path.join(OUTDIR, fname), Buffer.from(shot.data, 'base64'));
    console.log(`  ${fname}  (${s.name})`);
  }

  console.log('\n完成，共 ' + screens.length + ' 张');

  ws.close();
  chrome.kill();
  await sleep(200);
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch (_) {}
})();

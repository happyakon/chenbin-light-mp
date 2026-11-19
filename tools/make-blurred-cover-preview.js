/**
 * 虚化封面效果预览
 *
 * 用真实照片 + 真实的 sharp 模糊参数生成，
 * 和线上实际效果一致。
 */
const fs = require('fs');
const path = require('path');
const sharp = require('D:/workspace/chenbin-light/node_modules/sharp');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots');
fs.mkdirSync(OUT, { recursive: true });

const SRC = path.join(
  __dirname,
  '..',
  '..',
  'chenbin-light',
  'photos',
  'portrait',
  'people',
  'mmexport1665856929174.jpg'
);

/* 另一张图，用来模拟「旁边的正常相册」 */
const SRC2 = path.join(
  __dirname,
  '..',
  '..',
  'chenbin-light',
  'photos',
  'children',
  'kids',
  'DSC_3354.jpg'
);

(async () => {
  if (!fs.existsSync(SRC)) {
    console.log('找不到源图:', SRC);
    process.exit(1);
  }

  const hasSecond = fs.existsSync(SRC2);

  /* 清晰缩略图（people） */
  const cleanBuf = await sharp(SRC)
    .rotate()
    .resize({ width: 480, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true, chromaSubsampling: '4:2:0' })
    .toBuffer();

  /* 虚化图（people，和线上 blur 档参数一致） */
  const blurBuf = await sharp(SRC)
    .rotate()
    .resize({ width: 480, withoutEnlargement: true })
    .blur(12)
    .jpeg({ quality: 70, mozjpeg: true, chromaSubsampling: '4:2:0' })
    .toBuffer();

  /* 旁边的正常相册封面（kids） */
  let otherB64 = '';
  if (hasSecond) {
    const buf = await sharp(SRC2)
      .rotate()
      .resize({ width: 480, withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true, chromaSubsampling: '4:2:0' })
      .toBuffer();
    otherB64 = buf.toString('base64');
  }

  const cleanB64 = cleanBuf.toString('base64');
  const blurB64 = blurBuf.toString('base64');

  console.log(`  清晰: ${(cleanBuf.length / 1024).toFixed(1)} KB`);
  console.log(`  虚化: ${(blurBuf.length / 1024).toFixed(1)} KB`);

  const css = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #141414; padding: 36px;
      font-family: -apple-system, "PingFang SC", sans-serif;
      display: flex; gap: 32px; justify-content: center;
    }
    .wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; }
    .row { display: flex; gap: 16px; }

    .card { width: 172px; }

    .cover-wrap {
      position: relative;
      width: 100%;
      aspect-ratio: 3 / 4;
      border-radius: 4px;
      overflow: hidden;
      background: #141414;
      box-shadow: 0 3px 14px rgba(0,0,0,.5);
    }

    .cover {
      width: 100%; height: 100%;
      object-fit: cover;
      display: block;
    }
    .cover.is-blurred { opacity: .72; }

    .shade {
      position: absolute; left: 0; right: 0; bottom: 0;
      height: 55%;
      background: linear-gradient(to top, rgba(0,0,0,.85), transparent);
      z-index: 1;
    }

    .badge {
      position: absolute; top: 8px; right: 8px;
      width: 24px; height: 24px; border-radius: 50%;
      background: rgba(0,0,0,.6);
      border: 1px solid rgba(201,168,106,.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; z-index: 3;
    }

    .need-pass {
      position: absolute; right: 6px; bottom: 6px;
      padding: 2px 6px; border-radius: 10px;
      border: 1px solid rgba(201,168,106,.42);
      background: rgba(0,0,0,.55);
      font-size: 9px; letter-spacing: .06em;
      color: rgba(201,168,106,.9);
      z-index: 3;
    }

    .cover-text {
      position: absolute; left: 0; right: 0; bottom: 0;
      padding: 14px 12px 12px;
      z-index: 2;
    }
    .cn {
      font-family: "Songti SC", "SimSun", serif;
      font-size: 15px; letter-spacing: .08em; color: #f0efec;
    }
    .en {
      margin-top: 5px; font-size: 8px;
      letter-spacing: .14em;
      color: rgba(240,239,236,.5);
      text-transform: uppercase;
    }
    .count {
      margin-top: 6px; font-size: 11px;
      letter-spacing: .06em; color: #5a5956;
    }

    /* 旧版：纯黑占位 */
    .cover-empty {
      position: relative;
      width: 100%; height: 100%;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: linear-gradient(158deg, #1c1c22 0%, #141418 48%, #0e0e11 100%);
      overflow: hidden;
    }
    .empty-glow {
      position: absolute; left: 50%; top: 50%;
      width: 140px; height: 140px;
      margin-left: -70px; margin-top: -70px;
      border-radius: 50%;
      background: radial-gradient(circle,
        rgba(201,168,106,.15) 0%,
        rgba(201,168,106,.06) 34%,
        rgba(201,168,106,.016) 56%,
        rgba(201,168,106,0) 74%);
    }
    .empty-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(to right, rgba(240,239,236,.025) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(240,239,236,.025) 1px, transparent 1px);
      background-size: 28px 28px;
    }
    .lock-badge {
      position: relative;
      width: 48px; height: 48px;
      display: flex; align-items: center; justify-content: center;
    }
    .lock-ring {
      position: absolute;
      width: 48px; height: 48px;
      border-radius: 50%;
      border: 1px solid rgba(201,168,106,.3);
      background: rgba(201,168,106,.03);
    }
    .lock-icon {
      position: relative;
      font-size: 22px; line-height: 1;
      text-shadow: 0 1.5px 6px rgba(201,168,106,.4);
    }
    .empty-caption {
      position: relative; margin-top: 9px;
      font-size: 10px; letter-spacing: .22em;
      text-indent: .22em;
      color: rgba(201,168,106,.5);
    }

    .cap { font-size: 12px; text-align: center; max-width: 360px; line-height: 1.7; }
    .cap.bad { color: #d98b8b; }
    .cap.good { color: #7ec99a; }
  `;

  function normalCard(src, cn, en, count) {
    return `
    <div class="card">
      <div class="cover-wrap">
        <img class="cover" src="${src}" />
        <div class="shade"></div>
        <div class="cover-text">
          <div class="cn">${cn}</div>
          <div class="en">${en}</div>
        </div>
      </div>
      <div class="count">${count} 张</div>
    </div>`;
  }

  function lockedCard(src, blurred) {
    return `
    <div class="card">
      <div class="cover-wrap">
        <img class="cover ${blurred ? 'is-blurred' : ''}" src="${src}" />
        <div class="shade"></div>
        <div class="badge">🔒</div>
        ${blurred ? '<div class="need-pass">需要密码</div>' : ''}
        <div class="cover-text">
          <div class="cn">人物光影</div>
          <div class="en">Portraits</div>
        </div>
      </div>
      <div class="count">28 张</div>
    </div>`;
  }

  function emptyCard() {
    return `
    <div class="card">
      <div class="cover-wrap">
        <div class="cover-empty">
          <div class="empty-glow"></div>
          <div class="empty-grid"></div>
          <div class="lock-badge">
            <div class="lock-ring"></div>
            <div class="lock-icon">🔒</div>
          </div>
          <div class="empty-caption">加密相册</div>
        </div>
        <div class="shade"></div>
        <div class="badge">🔒</div>
        <div class="cover-text">
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

<div class="wrap">
  <div class="row">
    ${normalCard(otherB64 ? `data:image/jpeg;base64,${otherB64}` : `data:image/jpeg;base64,${cleanB64}`, '童年纪事', 'Childhood Days', 29)}
    ${emptyCard()}
  </div>
  <div class="cap bad">改动前：加锁相册是纯色占位，看不出内容</div>
</div>

<div class="wrap">
  <div class="row">
    ${normalCard(otherB64 ? `data:image/jpeg;base64,${otherB64}` : `data:image/jpeg;base64,${cleanB64}`, '童年纪事', 'Childhood Days', 29)}
    ${lockedCard(`data:image/jpeg;base64,${blurB64}`, true)}
  </div>
  <div class="cap good">改动后：封面虚化，能看出是人像，但看不清细节</div>
</div>

</body>
</html>`;

  const file = path.join(OUT, 'blurred-cover-preview.html');
  fs.writeFileSync(file, html, 'utf8');
  console.log('生成:', file);
})();

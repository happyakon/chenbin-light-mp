/**
 * 测试背景图上传 + 裁剪全流程
 *
 * 用一个横图测试，验证：
 *   1. 上传后返回原图尺寸（不裁切）
 *   2. 可以选择任意区域裁剪
 *   3. 输出 1440×2560 高质量图
 */
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://localhost:3000';
const PASS = process.argv[3] || 'test123456';

let pass = 0;
let fail = 0;

function ok(cond, label, extra) {
  if (cond) {
    pass += 1;
    console.log(`  ok   ${label}${extra ? '  ' + extra : ''}`);
  } else {
    fail += 1;
    console.log(`  FAIL ${label}${extra ? '  →  ' + extra : ''}`);
  }
}

async function main() {
  console.log('\n=== 背景图上传 + 裁剪测试 ===\n');

  /* 登录 */
  const login = await fetch(BASE + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: 'admin', password: PASS }),
  });
  const cookie = (login.headers.get('set-cookie') || '').split(';')[0];
  ok(login.ok && cookie, '管理员登录');

  /* 造一张横图测试（1200×800） */
  const sharp = require('D:/workspace/chenbin-light/node_modules/sharp');
  const testImg = await sharp({
    create: {
      width: 1200,
      height: 800,
      channels: 3,
      background: { r: 30, g: 40, b: 60 },
    },
  })
    .jpeg({ quality: 90 })
    .toBuffer();
  ok(testImg.length > 0, '生成测试横图', '1200×800');

  /* 上传 */
  const boundary = '----bg' + Date.now();
  const body = Buffer.concat([
    Buffer.from('--' + boundary + '\r\n'),
    Buffer.from('Content-Disposition: form-data; name="file"; filename="test.jpg"\r\n'),
    Buffer.from('Content-Type: image/jpeg\r\n\r\n'),
    testImg,
    Buffer.from('\r\n--' + boundary + '--\r\n'),
  ]);

  const up = await fetch(BASE + '/api/admin/home/bg', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data; boundary=' + boundary,
      Cookie: cookie,
    },
    body,
  });
  const upData = await up.json();
  ok(up.status === 200 && upData.ok, '上传成功');
  ok(upData.rawImage === '/home/bg-raw.jpg', '返回原图路径', upData.rawImage);
  ok(upData.width === 1200 && upData.height === 800, '返回原图尺寸（未裁切）', `${upData.width}×${upData.height}`);

  /* 原图可访问 */
  const rawHead = await fetch(BASE + upData.rawImage, { method: 'HEAD' });
  ok(rawHead.status === 200, '原图可访问', String(rawHead.status));

  /* 裁剪：从横图中间裁一个 9:16 区域 */
  console.log('\n  裁剪测试：');
  const crop = await fetch(BASE + '/api/admin/home/bg/crop', {
    method: 'POST',
    headers: { Cookie: cookie, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // 1200×800 的图，要裁 9:16 → 宽度 = 800 * 9/16 = 450
      // 居中：x = (1200-450)/2 / 1200 = 0.3125
      x: 0.3125,
      y: 0,
      w: 450 / 1200,
      h: 1,
    }),
  });
  const cropData = await crop.json();
  if (!cropData.ok) {
    console.log('  裁剪失败响应:', JSON.stringify(cropData));
  }
  ok(crop.status === 200 && cropData.ok, '裁剪成功', cropData.bgImage || cropData.error);

  if (!cropData.bgImage) {
    console.log('\n  ⚠ 裁剪没有返回 bgImage，后续测试跳过');
    console.log(`\n${'─'.repeat(50)}`);
    console.log(`  通过 ${pass} 项，失败 ${fail + 1} 项`);
    console.log(`${'─'.repeat(50)}\n`);
    return;
  }

  /* 验证输出 */
  const finalHead = await fetch(BASE + cropData.bgImage, { method: 'HEAD' });
  ok(finalHead.status === 200, '裁剪后图片可访问');
  const finalLen = Number(finalHead.headers.get('content-length') || 0);
  ok(finalLen > 0, '有文件大小', `${Math.round(finalLen / 1024)} KB`);

  /* 用 sharp 验证实际尺寸 */
  const finalBuf = Buffer.from(
    await (await fetch(BASE + cropData.bgImage)).arrayBuffer()
  );
  const outMeta = await sharp(finalBuf).metadata();
  ok(outMeta.width === 1440, '输出宽度 1440', String(outMeta.width));
  ok(outMeta.height === 2560, '输出高度 2560', String(outMeta.height));
  ok(outMeta.chromaSubsampling === '4:4:4', '色度抽样 4:4:4（无损颜色）', outMeta.chromaSubsampling);

  /* 小程序端能看到 */
  const cfg = await (await fetch(BASE + '/api/mp/config')).json();
  ok(cfg.home.bgImage.startsWith('/home/bg.jpg'), '小程序端拿到新背景图', cfg.home.bgImage);

  /* 边界：裁剪超出范围 */
  // x=0.99 时剩余只有 1%，小于最小 5%，返回 400 是正确行为
  const bad = await fetch(BASE + '/api/admin/home/bg/crop', {
    method: 'POST',
    headers: { Cookie: cookie, 'Content-Type': 'application/json' },
    body: JSON.stringify({ x: 0.99, y: 0.99, w: 0.5, h: 0.5 }),
  });
  ok(bad.status === 400, '区域过小时返回 400（正确拒绝）', String(bad.status));

  // 部分越界应该被钳制，不报错
  const clamp = await fetch(BASE + '/api/admin/home/bg/crop', {
    method: 'POST',
    headers: { Cookie: cookie, 'Content-Type': 'application/json' },
    body: JSON.stringify({ x: 0.1, y: 0.1, w: 0.95, h: 0.95 }),
  });
  ok(clamp.status === 200, '部分越界自动钳制', String(clamp.status));

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`  通过 ${pass} 项，失败 ${fail} 项`);
  console.log(`${'─'.repeat(50)}\n`);

  // 恢复真实背景图
  console.log('  （测试完成，请重新上传你的真实背景图）\n');
}

main().catch((e) => {
  console.error('异常:', e);
  process.exit(1);
});

/**
 * 单独调试上传接口
 */
const sharp = require('D:/workspace/chenbin-light/node_modules/sharp');

(async () => {
  const BASE = 'http://localhost:3000';

  /* 登录 */
  const login = await fetch(BASE + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: 'admin', password: 'test123456' }),
  });
  const cookie = (login.headers.get('set-cookie') || '').split(';')[0];
  console.log('登录:', login.status, cookie ? '有 cookie' : '无 cookie');

  /* 造图 */
  const img = await sharp({
    create: { width: 1200, height: 800, channels: 3, background: { r: 30, g: 40, b: 60 } },
  })
    .jpeg()
    .toBuffer();
  console.log('测试图:', img.length, 'bytes');

  /* 上传 */
  const boundary = '----dbg' + Date.now();
  const parts = [
    Buffer.from('--' + boundary + '\r\n'),
    Buffer.from('Content-Disposition: form-data; name="file"; filename="t.jpg"\r\n'),
    Buffer.from('Content-Type: image/jpeg\r\n\r\n'),
    img,
    Buffer.from('\r\n--' + boundary + '--\r\n'),
  ];
  const body = Buffer.concat(parts);

  const up = await fetch(BASE + '/api/admin/home/bg', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data; boundary=' + boundary,
      Cookie: cookie,
    },
    body,
  });

  const text = await up.text();
  console.log('\n上传响应:');
  console.log('  状态:', up.status);
  console.log('  内容:', text);

  /* 如果成功，测裁剪 */
  let data;
  try {
    data = JSON.parse(text);
  } catch (_) {}

  if (data && data.ok) {
    const crop = await fetch(BASE + '/api/admin/home/bg/crop', {
      method: 'POST',
      headers: { Cookie: cookie, 'Content-Type': 'application/json' },
      body: JSON.stringify({ x: 0.3125, y: 0, w: 0.375, h: 1 }),
    });
    const cropText = await crop.text();
    console.log('\n裁剪响应:');
    console.log('  状态:', crop.status);
    console.log('  内容:', cropText);
  }
})().catch((e) => {
  console.error('异常:', e.message);
});

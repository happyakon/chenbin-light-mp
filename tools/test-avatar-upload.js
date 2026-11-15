/**
 * 测试关于页头像上传
 */
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://localhost:3000';
const PASS = process.argv[3] || 'test123456';
const IMG = process.argv[4] || path.join(__dirname, '..', '..', 'chenbin-light', 'shots', 'mp-proto', 'scenery-0.jpg');

(async () => {
  const login = await fetch(BASE + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: 'admin', password: PASS }),
  });
  const cookie = (login.headers.get('set-cookie') || '').split(';')[0];
  console.log('  管理员登录:', login.ok ? 'OK' : '失败');

  if (!fs.existsSync(IMG)) {
    console.log('  测试图片不存在:', IMG);
    return;
  }

  const img = fs.readFileSync(IMG);
  const boundary = '----test' + Date.now();
  const parts = [
    Buffer.from('--' + boundary + '\r\n'),
    Buffer.from('Content-Disposition: form-data; name="file"; filename="avatar.jpg"\r\n'),
    Buffer.from('Content-Type: image/jpeg\r\n\r\n'),
    img,
    Buffer.from('\r\n--' + boundary + '--\r\n'),
  ];
  const body = Buffer.concat(parts);

  const r = await fetch(BASE + '/api/admin/about/avatar', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data; boundary=' + boundary,
      Cookie: cookie,
    },
    body,
  });
  const text = await r.text();
  console.log('  上传:', r.status, text);

  const g = await (await fetch(BASE + '/api/admin/about', { headers: { Cookie: cookie } })).json();
  console.log('  配置里的 avatar:', JSON.stringify(g.about && g.about.avatar));

  if (g.about && g.about.avatar) {
    const url = BASE + g.about.avatar;
    const head = await fetch(url, { method: 'HEAD' });
    console.log('  头像可访问:', head.status, head.headers.get('content-type'), head.headers.get('content-length') + ' bytes');
  }
})();

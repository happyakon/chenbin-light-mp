/**
 * 测试首页背景图全流程
 *
 * 1. 上传背景图
 * 2. 验证小程序端能拿到
 * 3. 验证图片可访问
 * 4. 保存文案
 * 5. 移除背景图
 */
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://localhost:3000';
const PASS = process.argv[3] || 'test123456';
const IMG = process.argv[4] || 'D:/workspace/chenbin-light/shots/mp-proto/scenery-0.jpg';

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

(async () => {
  console.log('\n=== 首页背景图测试 ===\n');

  /* 登录 */
  const login = await fetch(BASE + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: 'admin', password: PASS }),
  });
  const cookie = (login.headers.get('set-cookie') || '').split(';')[0];
  ok(login.ok && cookie, '管理员登录');

  /* 上传背景图 */
  if (!fs.existsSync(IMG)) {
    console.log('  测试图片不存在:', IMG);
    process.exit(1);
  }
  const img = fs.readFileSync(IMG);
  const boundary = '----bg' + Date.now();
  const body = Buffer.concat([
    Buffer.from('--' + boundary + '\r\n'),
    Buffer.from('Content-Disposition: form-data; name="file"; filename="bg.jpg"\r\n'),
    Buffer.from('Content-Type: image/jpeg\r\n\r\n'),
    img,
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
  ok(up.status === 200 && upData.ok, '上传背景图');
  ok(upData.bgImage === '/home/bg.jpg', '返回正确路径', upData.bgImage);
  ok(upData.size > 0, '图片有大小', `${Math.round(upData.size / 1024)} KB`);

  /* 小程序端能看到 */
  const cfg = await (await fetch(BASE + '/api/mp/config')).json();
  ok(cfg.home && cfg.home.bgImage === '/home/bg.jpg', '小程序端拿到 bgImage');
  ok(typeof cfg.home.title === 'string', 'home.title 字段存在');
  ok(typeof cfg.home.cardBody === 'string', 'home.cardBody 字段存在');

  /* 图片可访问 */
  const r = await fetch(BASE + cfg.home.bgImage, { method: 'HEAD' });
  ok(r.status === 200, '背景图可访问', String(r.status));
  ok(
    (r.headers.get('content-type') || '').includes('image'),
    'Content-Type 正确',
    r.headers.get('content-type')
  );
  const len = Number(r.headers.get('content-length') || 0);
  ok(len > 10000 && len < 600000, '图片大小合理', `${Math.round(len / 1024)} KB`);

  /* 保存文案 */
  const put = await fetch(BASE + '/api/admin/home', {
    method: 'PUT',
    headers: { Cookie: cookie, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bgImage: '/home/bg.jpg',
      title: '测试标题',
      subtitle: '测试副标题',
      cardTitle: '测试卡片',
      cardBody: '测试正文内容',
    }),
  });
  const putData = await put.json();
  ok(put.status === 200 && putData.ok, '保存文案');
  ok(putData.home.title === '测试标题', '标题已保存');

  /* 小程序端拿到新文案 */
  const cfg2 = await (await fetch(BASE + '/api/mp/config')).json();
  ok(cfg2.home.title === '测试标题', '小程序端拿到新标题');
  ok(cfg2.home.subtitle === '测试副标题', '小程序端拿到新副标题');

  /* 移除背景图 */
  await fetch(BASE + '/api/admin/home', {
    method: 'PUT',
    headers: { Cookie: cookie, 'Content-Type': 'application/json' },
    body: JSON.stringify({ bgImage: '', title: '', subtitle: '', cardTitle: '', cardBody: '' }),
  });
  const cfg3 = await (await fetch(BASE + '/api/mp/config')).json();
  ok(cfg3.home.bgImage === '', '背景图已移除');
  ok(cfg3.home.title === '', '文案已清空（小程序会用默认值）');

  /* 恢复配置（方便你在开发者工具里看效果） */
  await fetch(BASE + '/api/admin/home', {
    method: 'PUT',
    headers: { Cookie: cookie, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bgImage: '/home/bg.jpg',
      title: '陈彬拾光集',
      subtitle: '我将去往山川湖海，在天地之间拾光。',
      cardTitle: '拾光者',
      cardBody: '一名热爱摄影的程序员，一心奔赴山野，用镜头记录自然的精妙。',
    }),
  });
  console.log('\n  （已恢复配置，开发者工具里可以直接看到效果）');

  console.log(`\n${'─'.repeat(46)}`);
  console.log(`  通过 ${pass} 项，失败 ${fail} 项`);
  console.log(`${'─'.repeat(46)}\n`);
  process.exit(fail ? 1 : 0);
})().catch((e) => {
  console.error('异常:', e);
  process.exit(1);
});

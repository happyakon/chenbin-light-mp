/**
 * 小程序后端接口测试
 *
 * 覆盖：登录、配置、照片列表（含点赞状态）、收藏、点赞、关于页配置
 */
const BASE = process.argv[2] || 'http://localhost:3000';

let pass = 0;
let failCount = 0;
const failures = [];

function ok(cond, label, extra) {
  if (cond) {
    pass += 1;
    console.log(`  ok   ${label}`);
  } else {
    failCount += 1;
    failures.push(label + (extra ? `  →  ${extra}` : ''));
    console.log(`  FAIL ${label}${extra ? '  →  ' + extra : ''}`);
  }
}

function eq(a, b, label) {
  ok(a === b, label, `期望 ${JSON.stringify(b)}，实际 ${JSON.stringify(a)}`);
}

(async () => {
  console.log(`\n=== 小程序后端接口测试  ${BASE} ===\n`);

  // ---------- 1. 登录
  console.log('[1] 静默登录');
  const loginRes = await fetch(`${BASE}/api/mp/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'test-code-' + Date.now() }),
  });
  const login = await loginRes.json();
  ok(loginRes.status === 200 && login.token, '登录返回 token');
  const token = login.token;
  const auth = { Authorization: 'Bearer ' + token };

  // 同一个 code 会得到同一个 mock openid 前缀，换个 code 是另一个用户
  const loginRes2 = await fetch(`${BASE}/api/mp/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'other-user-' + Date.now() }),
  });
  const login2 = await loginRes2.json();
  const auth2 = { Authorization: 'Bearer ' + login2.token };
  ok(login2.token && login2.token !== login.token, '不同 code 得到不同 token');

  // ---------- 2. 未登录访问
  console.log('\n[2] 未登录访问');
  const noAuth = await fetch(`${BASE}/api/mp/favorites`);
  eq(noAuth.status, 401, '未登录查收藏返回 401');

  // ---------- 3. 配置
  console.log('\n[3] 全局配置');
  const cfg = await (await fetch(`${BASE}/api/mp/config`, { headers: auth })).json();
  ok(cfg.ok === true, '配置接口正常');
  ok(typeof cfg.aboutEnabled === 'boolean', 'aboutEnabled 是布尔值');
  ok(Array.isArray(cfg.hero), 'hero 是数组');
  console.log('       关于页:', cfg.aboutEnabled, '轮播图:', cfg.hero.length, '张');

  // ---------- 4. 照片列表
  console.log('\n[4] 照片列表');
  const cols = await (await fetch(`${BASE}/api/collections`)).json();
  const album = cols.collections[0].albums[0];
  const photosRes = await fetch(
    `${BASE}/api/mp/albums/photos?c=${album.collection}&a=${album.key}`,
    { headers: auth }
  );
  const photosData = await photosRes.json();
  ok(photosRes.status === 200 && photosData.photos, '照片列表返回正常');
  const photoCount = (photosData.photos || []).length;
  console.log('       照片数:', photoCount);

  if (photoCount > 0) {
    const p0 = photosData.photos[0];
    ok(typeof p0.likeCount === 'number', '照片含 likeCount 字段');
    ok(typeof p0.liked === 'boolean', '照片含 liked 字段');
    ok(typeof p0.favorited === 'boolean', '照片含 favorited 字段');
    eq(p0.likeCount, 0, '初始点赞数为 0');
    eq(p0.liked, false, '初始未点赞');
    eq(p0.favorited, false, '初始未收藏');
  }

  const targetPath = photosData.photos[0].path;

  // ---------- 5. 收藏
  console.log('\n[5] 收藏');
  const favAdd = await fetch(`${BASE}/api/mp/favorites`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: targetPath }),
  });
  const favAddData = await favAdd.json();
  ok(favAdd.status === 200 && favAddData.favorited === true, '收藏成功');

  const favList = await (await fetch(`${BASE}/api/mp/favorites`, { headers: auth })).json();
  eq(favList.photos.length, 1, '收藏列表有 1 张');
  eq(favList.photos[0].path, targetPath, '收藏的是正确照片');

  // 用户的收藏对另一个用户不可见
  const favList2 = await (await fetch(`${BASE}/api/mp/favorites`, { headers: auth2 })).json();
  eq(favList2.photos.length, 0, '别人的收藏看不到');

  // 照片列表里 favorited 变 true
  const photosAfter = await (await fetch(
    `${BASE}/api/mp/albums/photos?c=${album.collection}&a=${album.key}`,
    { headers: auth }
  )).json();
  const pAfter = photosAfter.photos.find((p) => p.path === targetPath);
  eq(pAfter.favorited, true, '照片列表里 favorited 变 true');

  // 取消收藏
  const favDel = await fetch(`${BASE}/api/mp/favorites`, {
    method: 'DELETE',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: targetPath }),
  });
  const favDelData = await favDel.json();
  ok(favDel.status === 200 && favDelData.favorited === false, '取消收藏成功');

  // ---------- 6. 点赞
  console.log('\n[6] 点赞');
  const likeAdd = await fetch(`${BASE}/api/mp/likes`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: targetPath }),
  });
  const likeAddData = await likeAdd.json();
  ok(likeAdd.status === 200 && likeAddData.liked === true, '点赞成功');
  eq(likeAddData.likeCount, 1, '点赞数变 1');

  // 幂等：再点一次不增加
  const likeAgain = await (await fetch(`${BASE}/api/mp/likes`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: targetPath }),
  })).json();
  eq(likeAgain.likeCount, 1, '重复点赞不增加计数');

  // 另一个用户点赞，总数变 2
  const like2 = await (await fetch(`${BASE}/api/mp/likes`, {
    method: 'POST',
    headers: { ...auth2, 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: targetPath }),
  })).json();
  eq(like2.likeCount, 2, '两个用户点赞后总数 2');

  // 点赞数是公开的：用户1 能看到 2
  const photosPub = await (await fetch(
    `${BASE}/api/mp/albums/photos?c=${album.collection}&a=${album.key}`,
    { headers: auth }
  )).json();
  const pPub = photosPub.photos.find((p) => p.path === targetPath);
  eq(pPub.likeCount, 2, '点赞数公开');

  // 点赞列表
  const likeList = await (await fetch(`${BASE}/api/mp/likes`, { headers: auth })).json();
  eq(likeList.photos.length, 1, '我的点赞有 1 张');

  // 取消点赞
  const likeDel = await (await fetch(`${BASE}/api/mp/likes`, {
    method: 'DELETE',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: targetPath }),
  })).json();
  eq(likeDel.likeCount, 1, '取消后总数回到 1');
  eq(likeDel.liked, false, '状态变未点赞');

  // 清理另一个用户的点赞
  await fetch(`${BASE}/api/mp/likes`, {
    method: 'DELETE',
    headers: { ...auth2, 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: targetPath }),
  });

  // ---------- 7. 关于页配置（管理端）
  console.log('\n[7] 关于页配置');
  const adminLogin = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: 'admin', password: process.env.ADMIN_PASSWORD || 'test123456' }),
  });
  const adminCookie = (adminLogin.headers.get('set-cookie') || '').split(';')[0];
  ok(adminLogin.ok && adminCookie, '管理员登录');

  const aboutGet = await (await fetch(`${BASE}/api/admin/about`, {
    headers: { Cookie: adminCookie },
  })).json();
  ok(aboutGet.ok === true, '读取关于页配置');
  console.log('       当前:', JSON.stringify(aboutGet.about));

  // 保存配置
  const aboutPut = await (await fetch(`${BASE}/api/admin/about`, {
    method: 'PUT',
    headers: { Cookie: adminCookie, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      enabled: true,
      name: '陈彬',
      tagline: '摄影师 · 记录者',
      bio: '独立摄影师，因为女儿出生开始拿起相机。',
      contacts: [
        { label: '微信', value: 'chenbin_photo' },
        { label: '邮箱', value: 'chen@example.com' },
      ],
    }),
  })).json();
  ok(aboutPut.ok === true, '保存关于页配置');
  eq(aboutPut.about.enabled, true, '关于页已启用');
  eq(aboutPut.about.contacts.length, 2, '联系方式 2 条');

  // 小程序端能看到
  const cfg2 = await (await fetch(`${BASE}/api/mp/config`, { headers: auth })).json();
  eq(cfg2.aboutEnabled, true, '小程序端看到关于页已启用');
  ok(cfg2.about && cfg2.about.name === '陈彬', '小程序端能看到关于内容');

  // 关闭
  await fetch(`${BASE}/api/admin/about`, {
    method: 'PUT',
    headers: { Cookie: adminCookie, 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled: false }),
  });
  const cfg3 = await (await fetch(`${BASE}/api/mp/config`, { headers: auth })).json();
  eq(cfg3.aboutEnabled, false, '关闭后小程序端也看不到');

  // ---------- 8. 边界
  console.log('\n[8] 边界情况');
  const badAlbum = await fetch(`${BASE}/api/mp/albums/photos?c=xxx&a=yyy`, { headers: auth });
  eq(badAlbum.status, 404, '不存在的相册返回 404');

  const noPath = await fetch(`${BASE}/api/mp/favorites`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  eq(noPath.status, 400, '缺 path 返回 400');

  const badToken = await fetch(`${BASE}/api/mp/favorites`, {
    headers: { Authorization: 'Bearer invalid-token' },
  });
  eq(badToken.status, 401, '无效 token 返回 401');

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`  通过 ${pass} 项，失败 ${failCount} 项`);
  if (failCount) {
    console.log('\n  失败明细：');
    for (const f of failures) console.log('    - ' + f);
  }
  console.log(`${'─'.repeat(50)}\n`);

  process.exit(failCount ? 1 : 0);
})().catch((e) => {
  console.error('\n异常:', e);
  process.exit(1);
});

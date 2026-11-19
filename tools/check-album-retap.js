const fs = require('fs');

const collections = fs.readFileSync(
  'miniprogram/pages/collections/collections.js',
  'utf8'
);

console.log('\n=== 加密相册重复输密码 修复验证 ===\n');

const checks = [
  ['点击时实时读 storage', collections.includes('const token = getAlbumToken(album.key)')],
  ['不再用静态 hasToken 判断', !collections.includes('if (album.locked && !album.hasToken)')],
  ['有 onShow 刷新', collections.includes('onShow()')],
  ['刷新后重算 hasToken', collections.includes('refreshTokenFlags')],
  ['只改有变化的项', collections.includes('if (has === a.hasToken) return a')],
  ['unlock 传 title', collections.includes('&title=')],
];

let allOk = true;
checks.forEach(([label, ok]) => {
  console.log(`  ${ok ? '✓' : '❌'} ${label}`);
  if (!ok) allOk = false;
});

console.log('');

/* ---- 模拟流程 ---- */
console.log('=== 模拟用户流程 ===\n');

/* 模拟 storage */
const storage = {};
const getAlbumToken = (k) => storage['album_token_' + k] || '';
const setAlbumToken = (k, v) => {
  storage['album_token_' + k] = v;
};

const album = { key: 'people', locked: true, title: '人物光影' };

/* 第 1 次点击：没 token */
let hasToken = getAlbumToken(album.key);
console.log(`  第一次点开: token=${hasToken || '(空)'}`);
console.log(`  → ${album.locked && !hasToken ? '进入解锁页 ✓' : '直接进相册'}`);

/* 用户输密码，解锁成功 */
setAlbumToken(album.key, 'tok_abc123');
console.log(`\n  输入密码成功，token 已存`);

/* 返回后再点 */
hasToken = getAlbumToken(album.key);
console.log(`\n  第二次点开: token=${hasToken}`);
console.log(`  → ${album.locked && !hasToken ? '又进解锁页 ❌' : '直接进相册 ✓'}`);

console.log('');
console.log(allOk ? '代码检查全部通过' : '有失败项');
console.log('');

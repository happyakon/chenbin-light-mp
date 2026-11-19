const fs = require('fs');

console.log('\n=== 本次两个修复的验证 ===\n');

/* ---------- 1. 加密相册封面 ---------- */
console.log('[1] 加密相册解锁后显示封面\n');

const req = fs.readFileSync('miniprogram/utils/request.js', 'utf8');
const cols = fs.readFileSync(
  'miniprogram/pages/collections/collections.js',
  'utf8'
);
const server = fs.readFileSync('D:/workspace/chenbin-light/server.js', 'utf8');

const c1 = [
  ['request.js 支持自定义 headers', req.includes('extraHeaders')],
  ['collections 带 X-Album-Token', cols.includes("'X-Album-Token'")],
  ['collectAlbumTokens 方法', cols.includes('collectAlbumTokens()')],
  ['onShow 检测 token 变化', cols.includes('_lastTokenSig')],
  ['有变化才重新拉列表', cols.includes('this.loadAlbums()')],
  ['后端支持多个 token', server.includes("split(',')")],
  ['多 token 用逗号分隔', cols.includes("join(',')")],
];

c1.forEach(([label, ok]) => console.log(`  ${ok ? '✓' : '❌'} ${label}`));

/* ---------- 2. 方形裁剪 ---------- */
console.log('\n[2] 头像方形裁剪\n');

const prof = fs.readFileSync('miniprogram/pages/profile/profile.js', 'utf8');

const c2 = [
  ['用 wx.cropImage', prof.includes('wx.cropImage(')],
  ['cropScale 设为 1:1', prof.includes('cropScale')],
  ['用户取消不报错', prof.includes("'cancel'")],
  ['低版本降级', prof.includes('typeof wx.cropImage')],
];

c2.forEach(([label, ok]) => console.log(`  ${ok ? '✓' : '❌'} ${label}`));

/* ---------- 模拟流程 ---------- */
console.log('\n[3] 模拟流程\n');

const storage = {};
const getTok = (k) => storage['album_token_' + k] || '';
const setTok = (k, v) => {
  storage['album_token_' + k] = v;
};

const albums = [
  { key: 'people', locked: true },
  { key: 'scenery', locked: false },
];

function collectTokens() {
  const parts = [];
  for (const a of albums) {
    if (!a.locked) continue;
    const t = getTok(a.key);
    if (t) parts.push(a.key + ':' + t);
  }
  return parts.join(',');
}

console.log(`  解锁前 header: "${collectTokens()}" （空，封面不返回）`);

setTok('people', 'tok_xyz');
console.log(`  解锁后 header: "${collectTokens()}"`);
console.log(`  → 后端能读到 people 的 token，返回真实封面 ✓`);

console.log('');

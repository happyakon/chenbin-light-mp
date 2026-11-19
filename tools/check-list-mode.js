const fs = require('fs');

const album = fs.readFileSync('miniprogram/pages/album/album.js', 'utf8');
const fav = fs.readFileSync('miniprogram/pages/favorites/favorites.js', 'utf8');
const like = fs.readFileSync('miniprogram/pages/likes/likes.js', 'utf8');
const img = fs.readFileSync('miniprogram/utils/image.js', 'utf8');

const checks = [
  ['image.js 有 setPendingList', img.includes('export function setPendingList')],
  ['image.js 有 takePendingList', img.includes('export function takePendingList')],
  ['image.js 取一次就删', img.includes('wx.removeStorageSync(PENDING_LIST_KEY)')],
  ['favorites 用 setPendingList', fav.includes('setPendingList(')],
  ['favorites 传 list=1', fav.includes('&list=1')],
  ['likes 用 setPendingList', like.includes('setPendingList(')],
  ['likes 传 list=1', like.includes('&list=1')],
  ['album 有 loadPhotosByPaths', album.includes('loadPhotosByPaths')],
  ['album 有 listMode', album.includes('listMode')],
  ['album 处理 list=1', album.includes("query.list === '1'")],
  ['album 按原顺序排序', album.includes('collected.sort')],
  ['album 限定模式进 viewer', album.includes("listMode: true")],
];

console.log('\n=== 改动确认 ===\n');
let allOk = true;
checks.forEach(([label, ok]) => {
  console.log(`  ${ok ? '✓' : '❌'} ${label}`);
  if (!ok) allOk = false;
});

console.log('');
console.log(allOk ? '全部通过' : '有失败项');
console.log('');

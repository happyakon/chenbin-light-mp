const fs = require('fs');

console.log('\n=== 卡片锁标记检查 ===\n');

const wxml = fs.readFileSync('miniprogram/pages/collections/collections.wxml', 'utf8');
const wxss = fs.readFileSync('miniprogram/pages/collections/collections.wxss', 'utf8');

const vo = (wxml.match(/<view/g) || []).length;
const vc = (wxml.match(/<\/view>/g) || []).length;
console.log(`  WXML view 配对: ${vo}/${vc} ${vo === vc ? '✓' : '❌'}`);

const checks = [
  ['中间叠加层存在', wxml.includes('lock-overlay')],
  ['中间用 SVG 图标', wxml.includes('lock-overlay-svg')],
  ['中间有 PRIVATE GALLERY', wxml.includes('Private Gallery')],
  ['右上角徽章存在', wxml.includes('class="badge"')],
  ['徽章也用 SVG', wxml.includes('badge-lock')],
  ['没有残留 emoji 锁', !wxml.includes('🔒')],
  [],
  ['中间叠加层样式', wxss.includes('.lock-overlay {')],
  ['中间锁宽度 50%', wxss.includes('width: 50%')],
  ['徽章锁样式', wxss.includes('.badge-lock {')],
];

checks.forEach((c) => {
  if (!c || !c.length) return;
  const [label, ok] = c;
  console.log(`  ${ok ? '✓' : '❌'} ${label}`);
});

console.log('');

const fs = require('fs');

console.log('\n=== 解锁页质感改造检查 ===\n');

const wxml = fs.readFileSync('miniprogram/pages/unlock/unlock.wxml', 'utf8');
const wxss = fs.readFileSync('miniprogram/pages/unlock/unlock.wxss', 'utf8');

/* 结构 */
const vo = (wxml.match(/<view/g) || []).length;
const vc = (wxml.match(/<\/view>/g) || []).length;
console.log(`  WXML view 配对: ${vo}/${vc} ${vo === vc ? '✓' : '❌'}`);

const bgLayers = (wxml.match(/class="bg-layer/g) || []).length;
console.log(`  背景层数量: ${bgLayers} ${bgLayers === 5 ? '✓' : '❌'}`);

/* WXSS 括号 */
const o = (wxss.match(/\{/g) || []).length;
const c = (wxss.match(/\}/g) || []).length;
console.log(`  WXSS 括号配对: ${o}/${c} ${o === c ? '✓' : '❌'}`);

console.log('');

/* 各层存在性 */
const layers = [
  ['bg-base 底层渐变', wxss.includes('.bg-base')],
  ['bg-glow 金色光晕', wxss.includes('.bg-glow')],
  ['bg-grid 网格纹理', wxss.includes('.bg-grid')],
  ['bg-band-top 顶部压暗', wxss.includes('.bg-band-top')],
  ['bg-band-bottom 底部压暗', wxss.includes('.bg-band-bottom')],
  ['lock-glow-outer 外柔光', wxss.includes('.lock-glow-outer')],
  ['lock-glow-inner 内柔光', wxss.includes('.lock-glow-inner')],
  ['title-rule 标题分隔线', wxss.includes('.title-rule')],
  ['按钮渐变背景', wxss.includes('linear-gradient(\n    180deg')],
  ['input 重置 button 默认样式', wxss.includes('margin: 28rpx 0 0 0')],
];

layers.forEach(([label, ok]) => console.log(`  ${ok ? '✓' : '❌'} ${label}`));

/* 禁用特性检查（WXSS 不支持或有问题） */
console.log('');
console.log('=== WXSS 兼容性检查 ===');

const bad = [
  ['filter: blur', /filter\s*:\s*blur/i.test(wxss)],
  ['vh 单位', /\d+vh\b/.test(wxss)],
  ['will-change', /will-change/i.test(wxss)],
  ['animation ... both', /animation:[^;]*\bboth\b/i.test(wxss)],
];

let badCount = 0;
bad.forEach(([label, found]) => {
  if (found) {
    console.log(`  ❌ 使用了不支持的 ${label}`);
    badCount += 1;
  } else {
    console.log(`  ✓ 没有用 ${label}`);
  }
});

console.log('');
console.log(badCount === 0 ? '全部通过' : `有 ${badCount} 处不兼容`);
console.log('');

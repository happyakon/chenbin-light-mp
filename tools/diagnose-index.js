/**
 * 诊断首页显示问题
 *
 * 逐层排查：
 *   1. 数据是否正确生成
 *   2. WXML 是否正确渲染
 *   3. CSS 是否有兼容性问题
 */
const fs = require('fs');
const path = require('path');

const P = path.join(__dirname, '..', 'miniprogram', 'pages', 'index');

console.log('=== 1. 检查 effects.js 的数据生成 ===\n');

// 模拟运行 effects.js 的逻辑
function splitVertical(text, baseDelay = 0, gap = 0.15) {
  return text
    .split('')
    .filter((ch) => ch !== ' ')
    .map((ch, i) => ({
      key: i,
      ch,
      delay: +(baseDelay + i * gap).toFixed(2),
    }));
}

const poem1 = splitVertical('光是时间的形状', 0.35, 0.11);
console.log('poem1 (' + poem1.length + ' 个字):');
console.log('  ' + JSON.stringify(poem1.slice(0, 3)));

const poem2 = splitVertical('我只负责记下', 1.05, 0.11);
console.log('poem2 (' + poem2.length + ' 个字):');
console.log('  ' + JSON.stringify(poem2.slice(0, 3)));

console.log('\n=== 2. 检查 WXML ===\n');
const wxml = fs.readFileSync(path.join(P, 'index.wxml'), 'utf8');

// 检查 wx:for 用法
const forMatches = wxml.match(/wx:for="\{\{[^}]+\}\}"/g) || [];
console.log('wx:for 数量:', forMatches.length);
forMatches.forEach((m) => console.log('  ' + m));

// 检查 data 里的 key 名字
console.log('\nWXML 里引用的数据字段:');
['particles', 'poem1', 'poem2', 'nameChars', 'phase', 'animate'].forEach((k) => {
  const used = wxml.includes(`{{${k}}}`) || wxml.includes(`${k}.length`);
  console.log(`  ${used ? '✓' : '·'} ${k}`);
});

console.log('\n=== 3. 检查 CSS 兼容性风险 ===\n');
const wxss = fs.readFileSync(path.join(P, 'index.wxss'), 'utf8');

const risks = [
  { name: 'filter: blur()', pattern: /filter:\s*blur/, why: '小程序对 filter 支持不完整，可能导致元素完全不可见' },
  { name: 'vh 单位', pattern: /-?\d+vh/, why: '部分基础库支持，但不如 rpx/px 保险' },
  { name: 'animation ... both', pattern: /animation:.*\bboth/, why: '如果初始状态是 opacity:0，both 会锁死在动画结束态' },
  { name: 'will-change', pattern: /will-change/, why: '小程序不一定支持' },
];

for (const r of risks) {
  const hits = (wxss.match(new RegExp(r.pattern.source, 'g')) || []).length;
  if (hits) {
    console.log(`  ⚠ ${r.name}  (${hits} 处)`);
    console.log(`     ${r.why}`);
  } else {
    console.log(`  ✓ ${r.name} 未使用`);
  }
}

console.log('\n=== 4. 关键：检查 opacity 初始值 ===\n');
// 找出所有设置了 opacity: 0 的类
const opacityZero = wxss.match(/\.[\w-]+\s*\{[^}]*opacity:\s*0[;}]/g) || [];
console.log('设置了 opacity:0 的类:');
opacityZero.forEach((m) => {
  const cls = m.match(/\.([\w-]+)/);
  console.log('  .' + (cls ? cls[1] : '?'));
});

console.log('\n=== 5. 检查 phase 初始值 ===\n');
const js = fs.readFileSync(path.join(P, 'index.js'), 'utf8');
const phaseMatch = js.match(/phase:\s*['"](\w+)['"]/);
console.log('  phase 初始值:', phaseMatch ? phaseMatch[1] : '未找到');
console.log('  animate 初始值:', /animate:\s*(true|false)/.exec(js)?.[1] || '未找到');

/**
 * 修复按钮宽度问题
 *
 * 思路：不用 width: 100%，改用 align-self: stretch
 * 这是 flex 布局里强制子项撑满交叉轴最可靠的方式。
 */
const fs = require('fs');

const F = 'miniprogram/pages/unlock/unlock.wxss';
let c = fs.readFileSync(F, 'utf8');

/* 1. .content 加 box-sizing */
c = c.replace(
  /\.content \{([\s\S]*?)padding: 0 88rpx 220rpx;\r?\n\}/,
  `.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /*
   * 底部留白比顶部多，视觉重心会上移。
   */
  padding: 0 88rpx 220rpx;
  box-sizing: border-box;
}`
);

/* 2. .input-wrap / .submit-wrap 改成 align-self: stretch */
c = c.replace(
  /\.input-wrap \{[\s\S]*?\}/,
  `.input-wrap {
  /*
   * ★ 用 align-self: stretch 而不是 width: 100%
   *
   * .content 是 align-items: center 的 flex 容器。
   * 在这种容器里，子元素的 width: 100% 表现不可靠
   * （尤其 <button> 会被当成内容宽度）。
   * stretch 是 flex 规范里「撑满交叉轴」的标准做法，最稳。
   */
  align-self: stretch;
  margin-top: 80rpx;
}`
);

c = c.replace(
  /\.submit-wrap \{[\s\S]*?\}/,
  `.submit-wrap {
  /* 同 .input-wrap，用 stretch 而不是 width: 100% */
  align-self: stretch;
  margin-top: 28rpx;
}`
);

/* 3. .warn / .error 的上边距从 48rpx 减到 28rpx（离按钮近一点） */
c = c.replace(/\.warn \{\s*\r?\n  margin-top: 48rpx;/, '.warn {\n  margin-top: 28rpx;');
c = c.replace(/\.error \{\s*\r?\n  margin-top: 48rpx;/, '.error {\n  margin-top: 28rpx;');

fs.writeFileSync(F, c, 'utf8');

console.log('\n=== 修改结果 ===\n');

const check = (label, cond) => console.log(`  ${cond ? '✓' : '❌'} ${label}`);

check('content 有 box-sizing', c.includes('padding: 0 88rpx 220rpx;\n  box-sizing: border-box;'));
check('input-wrap 用 stretch', /\.input-wrap \{[\s\S]*?align-self: stretch/.test(c));
check('submit-wrap 用 stretch', /\.submit-wrap \{[\s\S]*?align-self: stretch/.test(c));
check('warn 上边距 28rpx', /\.warn \{\s*\n\s*margin-top: 28rpx/.test(c));
check('error 上边距 28rpx', /\.error \{\s*\n\s*margin-top: 28rpx/.test(c));
check('没有残留 width: 100% 在 wrap 上', !/\.(input|submit)-wrap \{[\s\S]*?width: 100%/.test(c));

/* 括号配对 */
const o = (c.match(/\{/g) || []).length;
const cl = (c.match(/\}/g) || []).length;
console.log('');
console.log(`  WXSS 括号: ${o}/${cl} ${o === cl ? '✓' : '❌'}`);
console.log('');

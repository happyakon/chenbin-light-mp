/**
 * 彻底解决按钮宽度问题
 *
 * 之前试过都不行：
 *   width: 100%                 → 无效
 *   包一层 width:100% 的 view    → 无效
 *   align-self: stretch         → 无效
 *
 * 说明小程序的 <button> 组件有更底层的宽度计算逻辑。
 *
 * 新方案：不用 <button>，改用 <view> + bindtap。
 *   · view 没有任何默认样式，width: 100% 必然生效
 *   · 视觉上完全一样（本来就是自定义样式的按钮）
 *   · 唯一区别：失去 open-type 能力，但我们用不到
 */
const fs = require('fs');

const WXML = 'miniprogram/pages/unlock/unlock.wxml';
let wxml = fs.readFileSync(WXML, 'utf8');

/* 把 <button> 换成 <view> */
wxml = wxml.replace(
  /<view class="submit-wrap">[\s\S]*?<\/view>\s*<\/view>/,
  `<view class="submit-wrap">
      <!--
        用 <view> 而不是 <button>。

        小程序的 <button> 有自己的宽度计算逻辑，
        无论 width:100% / 包一层 view / align-self:stretch
        都没法让它和输入框等宽。

        <view> 没有默认样式，width:100% 必然生效，
        而且视觉上完全一样（样式本来就是自己写的）。
        唯一区别是失去 open-type 能力，这里用不到。
      -->
      <view
        class="submit {{submitting || retryAfter > 0 ? 'is-disabled' : ''}}"
        bindtap="onSubmit"
      >
        {{submitting ? '验证中…' : '进入'}}
      </view>
    </view>`
);

fs.writeFileSync(WXML, wxml, 'utf8');
console.log('\n=== WXML 修改结果 ===\n');

const hasButton = wxml.includes('<button');
const hasViewSubmit = wxml.includes('class="submit {{submitting');

console.log(`  ${!hasButton ? '✓' : '❌'} 已移除 <button>`);
console.log(`  ${hasViewSubmit ? '✓' : '❌'} 改成 <view class="submit">`);

/* 检查 disabled 逻辑还在不在 */
console.log(`  ${wxml.includes('retryAfter > 0') ? '✓' : '❌'} 保留了禁用状态判断`);

/* WXML 标签配对 */
const vo = (wxml.match(/<view/g) || []).length;
const vc = (wxml.match(/<\/view>/g) || []).length;
console.log(`  ${vo === vc ? '✓' : '❌'} view 配对: ${vo}/${vc}`);

console.log('');

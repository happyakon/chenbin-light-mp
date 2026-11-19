const fs = require('fs');

console.log('\n=== 按钮改 view 验证 ===\n');

const wxml = fs.readFileSync('miniprogram/pages/unlock/unlock.wxml', 'utf8');
const wxss = fs.readFileSync('miniprogram/pages/unlock/unlock.wxss', 'utf8');

const vo = (wxml.match(/<view/g) || []).length;
const vc = (wxml.match(/<\/view>/g) || []).length;
console.log(`  WXML view 配对: ${vo}/${vc} ${vo === vc ? '✓' : '❌'}`);
console.log(`  ${!wxml.includes('<button') ? '✓' : '❌'} 已无 <button>`);
console.log(`  ${wxml.includes('class="submit') ? '✓' : '❌'} submit 是 view`);
console.log(`  ${!wxml.includes('submit-wrap') ? '✓' : '❌'} 已删除 submit-wrap 包裹层`);

const o = (wxss.match(/\{/g) || []).length;
const c = (wxss.match(/\}/g) || []).length;
console.log(`  WXSS 括号: ${o}/${c} ${o === c ? '✓' : '❌'}`);
console.log(`  ${!wxss.includes('.submit-wrap') ? '✓' : '❌'} 已删除 .submit-wrap 样式`);
console.log(`  ${/\.submit \{[\s\S]*?display: flex/.test(wxss) ? '✓' : '❌'} .submit 有 display:flex`);
console.log(`  ${/\.submit \{[\s\S]*?align-self: stretch/.test(wxss) ? '✓' : '❌'} .submit 有 align-self:stretch`);

const inputH = wxss.match(/\.input \{[\s\S]*?height: (\d+)rpx/);
const submitH = wxss.match(/\.submit \{[\s\S]*?height: (\d+)rpx/);
console.log(`  ${inputH && submitH && inputH[1] === submitH[1] ? '✓' : '❌'} 高度一致: ${inputH ? inputH[1] : '?'} / ${submitH ? submitH[1] : '?'} rpx`);

/* JS 是否还能处理：onSubmit 还是必需的 */
const js = fs.readFileSync('miniprogram/pages/unlock/unlock.js', 'utf8');
console.log(`  ${js.includes('onSubmit()') ? '✓' : '❌'} JS 里有 onSubmit 方法`);

console.log('');

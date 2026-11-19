/**
 * 生成解锁页的锁图标（SVG → base64）
 *
 * 为什么不用 emoji：
 *   🔒 是彩色实心 emoji，无法改成线框风格，
 *   在深色背景上显廉价。
 *   用户给的效果图是「金色线框锁」，必须用 SVG 画。
 *
 * 为什么用 base64 而不是内联 SVG：
 *   小程序 WXML 不支持内联 <svg> 标签，
 *   只能用 <image src="data:image/svg+xml;base64,...">。
 */

/* 金色线框锁（参考用户给的图：圆角矩形锁体 + 半圆锁梁 + 钥匙孔） */
const LOCK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 56" fill="none" stroke="#c9a86a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <rect x="4" y="24" width="40" height="28" rx="4"/>
  <path d="M13 24V14a11 11 0 0 1 22 0v10"/>
  <circle cx="24" cy="37" r="3"/>
  <path d="M24 40v5"/>
</svg>`;

const b64 = Buffer.from(LOCK_SVG, 'utf8').toString('base64');
const dataUri = 'data:image/svg+xml;base64,' + b64;

console.log('\n=== 锁图标 base64 ===\n');
console.log(dataUri);
console.log('');
console.log('长度:', dataUri.length, '字符');
console.log('');

/* 顺便生成一个 HTML 预览，确认线条样式 */
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', '..', 'chenbin-light', 'shots');
fs.mkdirSync(OUT, { recursive: true });

const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
  body { background: #0d0d0d; margin: 0; padding: 60px; display: flex; gap: 60px; justify-content: center; align-items: center; }
  .col { display: flex; flex-direction: column; align-items: center; gap: 22px; }
  .cell { width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,.06); border-radius: 10px; }
  .old { font-size: 62px; line-height: 1; }
  .new { width: 82px; height: 96px; }
  .caption { font-size: 12px; color: #888; }
  .label { font-size: 13px; color: #ccc; letter-spacing: .2em; }
  .text-under { font-size: 11px; letter-spacing: .38em; color: #c9a86a; margin-top: 4px; }
</style></head>
<body>
  <div class="col">
    <div class="cell"><div class="old">🔒</div></div>
    <div class="caption">改动前：彩色 emoji</div>
  </div>
  <div class="col">
    <div class="cell">
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px">
        <img class="new" src="${dataUri}" />
        <div class="text-under">PRIVATE GALLERY</div>
      </div>
    </div>
    <div class="caption">改动后：金色线框 + 文字</div>
  </div>
</body></html>`;

fs.writeFileSync(path.join(OUT, 'lock-icon-preview.html'), html, 'utf8');
console.log('预览:', path.join(OUT, 'lock-icon-preview.html'));

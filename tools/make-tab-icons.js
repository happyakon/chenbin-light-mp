/**
 * 生成原生 tabBar 的图标
 *
 * 微信原生 tabBar 只接受 PNG/JPG 图片文件，不能写 SVG 或字体图标。
 * 这里用 sharp 把 SVG 渲染成 81×81 的 PNG（微信推荐尺寸）。
 *
 * 输出到 miniprogram/images/
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '..', 'chenbin-light-mp', 'miniprogram', 'images');

/** 颜色 */
const COLOR_NORMAL = '#5a5956';
const COLOR_ACTIVE = '#c9a86a';

const ICONS = {
  home: `<path d="M3 10.5 12 3l9 7.5V21H3z"/>`,
  grid: `<rect x="3" y="3" width="7" height="7" rx="1"/>
         <rect x="14" y="3" width="7" height="7" rx="1"/>
         <rect x="3" y="14" width="7" height="7" rx="1"/>
         <rect x="14" y="14" width="7" height="7" rx="1"/>`,
  user: `<circle cx="12" cy="8" r="4"/>
         <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>`,
  info: `<circle cx="12" cy="12" r="9"/>
         <path d="M12 8h.01"/>
         <path d="M11 12h1v4"/>`,
};

/** 生成一个 SVG 字符串 */
function makeSvg(iconPaths, color, filled) {
  const fill = filled ? color : 'none';
  // 注意：root 的 fill 用 none，具体形状里单独指定，避免 path 被填充成实心块
  return `<svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 24 24">
  <g fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    ${iconPaths}
  </g>
</svg>`;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  for (const [name, paths] of Object.entries(ICONS)) {
    // 普通态
    const normalSvg = makeSvg(paths, COLOR_NORMAL, false);
    await sharp(Buffer.from(normalSvg))
      .resize(81, 81)
      .png()
      .toFile(path.join(OUT, `tab-${name}.png`));

    // 选中态
    const activeSvg = makeSvg(paths, COLOR_ACTIVE, false);
    await sharp(Buffer.from(activeSvg))
      .resize(81, 81)
      .png()
      .toFile(path.join(OUT, `tab-${name}-on.png`));

    console.log(`  tab-${name}.png  /  tab-${name}-on.png`);
  }

  console.log('\n共生成 8 个图标');
}

main().catch((e) => {
  console.error('失败:', e);
  process.exit(1);
});

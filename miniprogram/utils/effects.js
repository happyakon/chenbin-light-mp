/**
 * 首页视觉效果的参数计算
 *
 * 全部用 CSS 实现，这个文件只负责「算出每个元素该在什么位置、延迟多久」。
 *
 * 性能原则：
 *   · 只动 transform 和 opacity，不动 top/left/width
 *   · 粒子数量控制在 20 个以内（小程序和网页不同，多了明显掉帧）
 *   · 所有动画用 CSS，不用 setInterval 逐帧改样式
 */

/**
 * 生成粒子（缓慢上升的光点）
 * @param {number} count 数量，建议 12-20
 * @returns {Array}
 */
export function makeParticles(count = 16) {
  const out = [];
  for (let i = 0; i < count; i += 1) {
    // 用「看起来随机但固定」的算法，避免每次渲染都跳位置
    const seed = (i * 9301 + 49297) % 233280;
    const rnd = seed / 233280;

    const seed2 = ((i + 7) * 4523 + 12345) % 100000;
    const rnd2 = seed2 / 100000;

    out.push({
      key: i,
      // 水平位置 0-100%
      left: +(rnd * 100).toFixed(1),
      // 起始垂直位置 55-100%（从下半部分开始）
      top: +(55 + rnd2 * 45).toFixed(1),
      // 大小 1.5-3.5px
      size: +(1.5 + rnd * 2).toFixed(1),
      // 动画时长 14-26s，各不相同，看起来不整齐才自然
      duration: +(14 + rnd2 * 12).toFixed(1),
      // 延迟 0-10s，错开
      delay: +(rnd * 10).toFixed(1),
      // 透明度 0.15-0.45
      opacity: +(0.15 + rnd2 * 0.3).toFixed(2),
    });
  }
  return out;
}

/**
 * 把句子拆成单个字，用于逐字浮现
 * @param {string} text
 * @param {number} baseDelay 起始延迟（秒）
 * @param {number} gap       每个字之间的间隔（秒）
 */
export function splitChars(text, baseDelay = 0, gap = 0.12) {
  return text.split('').map((ch, i) => ({
    key: i,
    ch,
    // 空格不显示，但仍占位
    isSpace: ch === ' ',
    delay: +(baseDelay + i * gap).toFixed(2),
  }));
}

/**
 * 竖排诗句的字符拆分
 * 竖排时每个字单独一个元素，从上往下排
 */
export function splitVertical(text, baseDelay = 0, gap = 0.15) {
  return text
    .split('')
    .filter((ch) => ch !== ' ')
    .map((ch, i) => ({
      key: i,
      ch,
      delay: +(baseDelay + i * gap).toFixed(2),
    }));
}

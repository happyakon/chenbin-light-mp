/**
 * 首页开场动画的版式计算
 *
 * 6 套固定版式，按轮播图数量自适应。
 * 全部用 CSS Grid 的 grid-area 表达。
 *
 * 核心约束：按原图比例填充，不强行裁方。
 */

/**
 * 根据图片数量选版式
 * @param {number} count 轮播图张数
 * @returns {{name:string, cells:Array<{area:string, imgIndex:number}>}}
 */
export function pickLayout(count) {
  if (count <= 0) return { name: 'default', cells: [] };
  if (count === 1) return layout1();
  if (count === 2) return layout2();
  if (count === 3) return layout3();
  if (count === 4) return layout4();
  if (count === 5) return layout5();
  if (count === 6) return layout6();
  // 7 张以上统一用 8 格版式
  return layout8(count);
}

/** 1 张：铺满 */
function layout1() {
  return {
    name: 'one',
    cells: [{ area: '1 / 1 / 2 / 2', imgIndex: 0 }],
  };
}

/** 2 张：上下分屏 */
function layout2() {
  return {
    name: 'two',
    cells: [
      { area: '1 / 1 / 2 / 2', imgIndex: 0 },
      { area: '2 / 1 / 3 / 2', imgIndex: 1 },
    ],
  };
}

/** 3 张：一大 + 两小 */
function layout3() {
  return {
    name: 'three',
    cells: [
      { area: '1 / 1 / 3 / 2', imgIndex: 0 },
      { area: '1 / 2 / 2 / 3', imgIndex: 1 },
      { area: '2 / 2 / 4 / 3', imgIndex: 2 },
    ],
  };
}

/** 4 张：2×2 大小交错 */
function layout4() {
  return {
    name: 'four',
    cells: [
      { area: '1 / 1 / 2 / 2', imgIndex: 0 },
      { area: '1 / 2 / 2 / 3', imgIndex: 1 },
      { area: '2 / 1 / 4 / 2', imgIndex: 2 },
      { area: '2 / 2 / 4 / 3', imgIndex: 3 },
    ],
  };
}

/** 5 张：大竖 + 三小 + 横条 */
function layout5() {
  return {
    name: 'five',
    cells: [
      { area: '1 / 1 / 4 / 2', imgIndex: 0 },
      { area: '1 / 2 / 2 / 3', imgIndex: 1 },
      { area: '2 / 2 / 3 / 3', imgIndex: 2 },
      { area: '3 / 2 / 4 / 3', imgIndex: 3 },
      { area: '4 / 1 / 5 / 3', imgIndex: 4 },
    ],
  };
}

/** 6 张：主图 + 环绕 */
function layout6() {
  return {
    name: 'six',
    cells: [
      { area: '1 / 1 / 2 / 3', imgIndex: 0 },
      { area: '2 / 1 / 3 / 2', imgIndex: 1 },
      { area: '2 / 2 / 4 / 3', imgIndex: 2 },
      { area: '3 / 1 / 4 / 2', imgIndex: 3 },
      { area: '4 / 1 / 5 / 3', imgIndex: 4 },
    ],
  };
}

/**
 * 8 格版式（7 张以上通用）
 * 7 张时第 8 格重复第 1 张
 */
function layout8(count) {
  const pick = (i) => (i < count ? i : i % count);
  return {
    name: 'eight',
    cells: [
      { area: '1 / 1 / 2 / 2', imgIndex: pick(0) },
      { area: '1 / 2 / 2 / 3', imgIndex: pick(1) },
      { area: '1 / 3 / 3 / 4', imgIndex: pick(2) },
      { area: '2 / 1 / 3 / 3', imgIndex: pick(3) },
      { area: '3 / 1 / 4 / 2', imgIndex: pick(4) },
      { area: '3 / 2 / 4 / 3', imgIndex: pick(5) },
      { area: '3 / 3 / 4 / 4', imgIndex: pick(6) },
      { area: '4 / 1 / 5 / 4', imgIndex: pick(7) },
    ],
  };
}

/**
 * 每套版式的网格行列定义
 * 值是 `grid-template-rows / grid-template-columns`
 */
export const LAYOUT_GRID = {
  one: { rows: '1fr', cols: '1fr' },
  two: { rows: '1fr 1fr', cols: '1fr' },
  three: { rows: '0.8fr 0.8fr 0.55fr', cols: '1.4fr 1fr' },
  four: { rows: '0.85fr 0.6fr 0.9fr', cols: '1fr 1.25fr' },
  five: { rows: '1fr 1fr 1.05fr 0.65fr', cols: '1.1fr 1fr' },
  six: { rows: '0.7fr 1fr 1fr 0.7fr', cols: '1fr 1.5fr' },
  eight: { rows: '1fr 0.8fr 0.95fr 0.72fr', cols: '1fr 1fr 1.35fr' },
};

/**
 * 飞入方向：8 种，依次循环
 * 返回 translate 的初始偏移（百分比）
 */
export const FLY_DIRS = [
  { x: -120, y: -120, name: 'tl' },
  { x: 120, y: -120, name: 'tr' },
  { x: 0, y: -140, name: 'top' },
  { x: 140, y: 0, name: 'right' },
  { x: 120, y: 120, name: 'br' },
  { x: -120, y: 120, name: 'bl' },
  { x: 0, y: 140, name: 'bottom' },
  { x: -140, y: 0, name: 'left' },
];

/**
 * 给每个格子分配飞入方向
 * @param {number} n 格子数
 */
export function assignDirs(n) {
  return Array.from({ length: n }, (_, i) => FLY_DIRS[i % FLY_DIRS.length]);
}

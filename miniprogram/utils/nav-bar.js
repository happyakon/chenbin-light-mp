/**
 * 自定义导航栏的工具
 *
 * 背景：页面用了 navigationStyle: custom（自绘导航栏），
 *       但微信右上角的胶囊按钮（··· ●）是系统画的，盖不住。
 *       如果导航栏右侧放了内容（比如"28 张"），就会被压住。
 *
 * 做法：用 wx.getMenuButtonBoundingClientRect() 拿到胶囊的
 *       左边界、上边界、高度，算出导航栏该留多少右侧空间、
 *       内容该垂直居中在哪个位置。
 */

/**
 * 获取胶囊按钮的布局信息
 *
 * @returns {{
 *   capsuleWidth: number,   胶囊总宽度（用于右侧留白）
 *   capsuleTop: number,     胶囊顶部距离屏幕顶部的距离
 *   capsuleHeight: number,  胶囊高度
 *   navHeight: number,      导航栏应有的高度
 *   navPaddingTop: number,  导航栏内容距顶部的内边距
 *   safeRight: number,      右侧需要留白的宽度（px）
 * }}
 */
export function getCapsuleLayout() {
  /* 兜底值：万一接口不可用，用经验值 */
  const fallback = {
    capsuleWidth: 87,
    capsuleTop: 26,
    capsuleHeight: 32,
    navHeight: 88,
    navPaddingTop: 26,
    safeRight: 95,
  };

  let rect = null;
  try {
    if (typeof wx.getMenuButtonBoundingClientRect === 'function') {
      rect = wx.getMenuButtonBoundingClientRect();
    }
  } catch (_) {}

  if (!rect || !rect.width || !rect.height) return fallback;

  /*
   * 胶囊的位置：
   *   rect.left   胶囊左边界
   *   rect.top    胶囊上边界（含状态栏）
   *   rect.width  胶囊宽度
   *   rect.height 胶囊高度
   *
   * 屏幕宽度 = rect.right + 右边距
   * 微信留的右边距通常是 7~10px
   */
  const screenWidth = (() => {
    try {
      const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
      return info.windowWidth || info.screenWidth || 375;
    } catch (_) {
      return 375;
    }
  })();

  const rightGap = Math.max(screenWidth - rect.right, 0);

  /*
   * 导航栏高度：
   *   胶囊顶部距屏幕顶 = rect.top
   *   胶囊下方留和上方一样的间距，视觉才平衡
   *   navHeight = rect.top * 2 + rect.height
   */
  const navHeight = rect.top * 2 + rect.height;

  return {
    capsuleWidth: rect.width,
    capsuleTop: rect.top,
    capsuleHeight: rect.height,
    navHeight,
    navPaddingTop: rect.top,
    /*
     * 右侧留白 = 胶囊宽度 + 右边距 + 一点点额外间隙
     * 这样内容右边缘会停在胶囊左边，不会重叠
     */
    safeRight: Math.ceil(rect.width + rightGap + 8),
  };
}

/**
 * 页面 / 组件里通用的导航栏数据
 *
 * 用法：
 *   const nav = getNavMetrics();
 *   this.setData({ ...nav });
 *
 * WXML：
 *   <view class="nav" style="height:{{navHeight}}px;padding-right:{{safeRight}}px">
 */
export function getNavMetrics() {
  const m = getCapsuleLayout();
  return {
    navHeight: m.navHeight,
    navPaddingTop: m.navPaddingTop,
    safeRight: m.safeRight,
    capsuleTop: m.capsuleTop,
  };
}

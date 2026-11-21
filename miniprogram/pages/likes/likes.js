/**
 * 我的点赞
 *
 * 3 列瀑布流，和收藏页结构完全一样，只差数据源。
 */
import { get } from '../../utils/request.js';
import { imgUrl, setPendingList } from '../../utils/image.js';
import { getNavMetrics } from '../../utils/nav-bar.js';
import { IS_DEBUG } from '../../config/index.js';

Page({
  data: {
    photos: [],
    col1: [],
    col2: [],
    col3: [],
    loading: true,
    emptyText: '还没有点赞',
    emptyHint: '在照片上点 ♡ 表示喜欢',
    statusBarHeight: 20,
      /* 右上角胶囊按钮占用的宽度，导航栏右侧要让出来 */
      safeRight: 95,
    title: '我的点赞',
  },

  onLoad() {
    let statusBarHeight = 20;
    try {
      const app = getApp();
      const info = (app && app.globalData.sysInfo) || wx.getWindowInfo();
      if (info && info.statusBarHeight) statusBarHeight = info.statusBarHeight;
    } catch (_) {}

    /* 量出胶囊位置，让导航栏避开右上角的三个点 */
      const navMetrics = getNavMetrics();
      this.setData({ statusBarHeight, ...navMetrics });
    this.load();
  },

  async load() {
    this.setData({ loading: true });
    try {
      const data = await get('/api/mp/likes', { silent: true });
      const photos = (data.photos || []).map((p) => ({
        ...p,
        thumbUrl: imgUrl(p.thumb, p.album),
        ratio: p.width && p.height ? p.height / p.width : 1.33,
      }));

      const cols = this.splitColumns(photos);
      this.setData({
        photos,
        col1: cols[0],
        col2: cols[1],
        col3: cols[2],
        loading: false,
      });
    } catch (err) {
      if (IS_DEBUG) console.warn('[likes] 加载失败', err);
      this.setData({ photos: [], col1: [], col2: [], col3: [], loading: false });
    }
  },

  /** 分 3 列：最小高度优先 */
  splitColumns(photos) {
    const cols = [[], [], []];
    const heights = [0, 0, 0];

    for (const p of photos) {
      let minIdx = 0;
      for (let i = 1; i < 3; i += 1) {
        if (heights[i] < heights[minIdx]) minIdx = i;
      }
      cols[minIdx].push(p);
      heights[minIdx] += p.ratio || 1.33;
    }

    return cols;
  },

  onPhotoTap(e) {
    const photo = e.currentTarget.dataset.photo;
    if (!photo) return;

    /* 只浏览点过赞的这几张，不是整个相册。理由见 favorites.js */
    const all = this.data.photos || [];
    const paths = all.map((p) => p.path);

    setPendingList({
      paths,
      focus: photo.path,
      title: '我的点赞',
    });

    wx.navigateTo({
      url:
        `/pages/album/album?c=${encodeURIComponent(photo.collection)}` +
        `&a=${encodeURIComponent(photo.album)}` +
        `&list=1`,
    });
  },

  goBack() {
    wx.navigateBack();
  },

  async onPullDownRefresh() {
    await this.load();
    wx.stopPullDownRefresh();
  },
});

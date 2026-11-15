/**
 * 收藏页
 *
 * 3 列瀑布流展示，和相册页的照片墙保持一致的视觉。
 */
import { get } from '../../utils/request.js';
import { imgUrl } from '../../utils/image.js';
import { IS_DEBUG } from '../../config/index.js';

Page({
  data: {
    photos: [],
    col1: [],
    col2: [],
    col3: [],
    loading: true,
    emptyText: '还没有收藏',
    emptyHint: '在照片上点 ☆ 收藏喜欢的照片',
    statusBarHeight: 20,
    title: '我的收藏',
  },

  onLoad() {
    let statusBarHeight = 20;
    try {
      const app = getApp();
      const info = (app && app.globalData.sysInfo) || wx.getWindowInfo();
      if (info && info.statusBarHeight) statusBarHeight = info.statusBarHeight;
    } catch (_) {}

    this.setData({ statusBarHeight });
    this.load();
  },

  async load() {
    this.setData({ loading: true });
    try {
      const data = await get('/api/mp/favorites', { silent: true });
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
      if (IS_DEBUG) console.warn('[favorites] 加载失败', err);
      this.setData({ photos: [], col1: [], col2: [], col3: [], loading: false });
    }
  },

  /**
   * 分 3 列：最小高度优先，避免某列特别长。
   * 和相册页用同一套算法。
   */
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

    wx.navigateTo({
      url:
        `/pages/album/album?c=${encodeURIComponent(photo.collection)}` +
        `&a=${encodeURIComponent(photo.album)}` +
        `&focus=${encodeURIComponent(photo.file)}`,
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

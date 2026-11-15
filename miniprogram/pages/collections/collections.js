/**
 * 摄影集页：顶部横向筛选 + 相册双列网格
 *
 * 筛选是第一版的样式：标题下方一排横向 chip（全部/风光/儿童/人像）
 * 不做底部弹出面板，也不依赖 onTabItemTap
 */
import { get } from '../../utils/request.js';
import { imgUrl, getAlbumToken } from '../../utils/image.js';
import { COLLECTION_TABS, IS_DEBUG } from '../../config/index.js';

Page({
  data: {
    /** 当前选中的摄影集 key，空 = 全部 */
    activeCollection: '',
    /** 筛选项 */
    tabs: COLLECTION_TABS,
    /** 全部相册（原始） */
    allAlbums: [],
    /** 当前显示的相册 */
    albums: [],
    loading: true,
    statusBarHeight: 20,
  },

  onLoad() {
    try {
      const app = getApp();
      const info = (app && app.globalData.sysInfo) || wx.getWindowInfo();
      if (info && info.statusBarHeight) {
        this.setData({ statusBarHeight: info.statusBarHeight });
      }
    } catch (_) {}

    this.loadAlbums();
  },

  /** 拉相册列表 */
  async loadAlbums() {
    this.setData({ loading: true });
    try {
      const data = await get('/api/collections', { auth: false });
      const all = [];

      for (const col of data.collections || []) {
        for (const a of col.albums || []) {
          all.push({
            ...a,
            collectionKey: col.key,
            collectionTitle: col.title,
            coverUrl: a.cover ? imgUrl(a.cover) : '',
            locked: Boolean(a.locked),
            hasToken: Boolean(getAlbumToken(a.key)),
          });
        }
      }

      this.setData({ allAlbums: all, loading: false });
      this.applyFilter(this.data.activeCollection, false);
    } catch (err) {
      if (IS_DEBUG) console.warn('[collections] 加载失败', err);
      this.setData({ loading: false });
    }
  },

  /** 应用筛选 */
  applyFilter(collectionKey, animate = true) {
    const all = this.data.allAlbums;
    const filtered = collectionKey
      ? all.filter((a) => a.collectionKey === collectionKey)
      : all;

    const albums = filtered.map((a, i) => ({
      ...a,
      animDelay: i * 40,
      animFrom: i % 2 === 0 ? 'left' : 'right',
      animIn: !animate,
    }));

    this.setData({ activeCollection: collectionKey, albums }, () => {
      if (!animate) return;
      setTimeout(() => {
        this.setData({
          albums: this.data.albums.map((a) => ({ ...a, animIn: true })),
        });
      }, 30);
    });
  },

  /** 点筛选项 */
  onTabTap(e) {
    const key = e.currentTarget.dataset.key || '';
    if (key === this.data.activeCollection) return;
    this.applyFilter(key);
  },

  /** 点相册 */
  onAlbumTap(e) {
    const album = e.currentTarget.dataset.album;
    if (!album) return;

    const url =
      `/pages/album/album?c=${encodeURIComponent(album.collectionKey)}` +
      `&a=${encodeURIComponent(album.key)}`;

    if (album.locked && !album.hasToken) {
      wx.navigateTo({
        url:
          `/pages/unlock/unlock?c=${encodeURIComponent(album.collectionKey)}` +
          `&a=${encodeURIComponent(album.key)}`,
      });
      return;
    }

    wx.navigateTo({ url });
  },

  onShareAppMessage() {
    return { title: '陈彬拾光集 · 摄影集', path: '/pages/collections/collections' };
  },
});

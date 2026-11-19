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
            /*
             * hasToken 只用于「显示锁图标」。
             *
             * ★ 不能拿它判断要不要进解锁页
             *   因为它是在 loadAlbums 时算的静态值，
             *   用户解锁后返回本页，onLoad 不会重新执行，
             *   这个值就一直是 false，导致每次点都要重新输密码。
             *   实际判断在 onAlbumTap 里实时读 storage。
             */
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

    /*
     * 加密相册：实时判断有没有 token。
     *
     * ★ 为什么不看 album.hasToken
     *   那是 loadAlbums 时的静态快照。
     *   用户解锁后返回，onLoad 不会再跑，快照仍是 false，
     *   结果就是「解锁过了还要再输一遍」。
     *
     *   每次点击都从 storage 现读，才反映最新状态。
     */
    const token = getAlbumToken(album.key);
    if (album.locked && !token) {
      wx.navigateTo({
        url:
          `/pages/unlock/unlock?c=${encodeURIComponent(album.collectionKey)}` +
          `&a=${encodeURIComponent(album.key)}` +
          `&title=${encodeURIComponent(album.title || '')}`,
      });
      return;
    }

    wx.navigateTo({ url });
  },

  /**
   * 每次显示本页都刷新 hasToken
   *
   * 从解锁页返回、从相册页返回时都会触发，
   * 保证锁图标的状态是最新的。
   */
  onShow() {
    this.refreshTokenFlags();
  },

  /** 重新算每个相册的 hasToken */
  refreshTokenFlags() {
    const all = this.data.allAlbums || [];
    if (!all.length) return;

    let changed = false;
    const next = all.map((a) => {
      if (!a.locked) return a;
      const has = Boolean(getAlbumToken(a.key));
      if (has === a.hasToken) return a;
      changed = true;
      return { ...a, hasToken: has };
    });

    if (!changed) return;

    this.setData({ allAlbums: next });
    this.applyFilter(this.data.activeCollection, false);
  },

  onShareAppMessage() {
    return { title: '陈彬拾光集 · 摄影集', path: '/pages/collections/collections' };
  },
});

/**
 * 摄影集页：顶部横向筛选 + 相册双列网格
 *
 * 筛选是第一版的样式：标题下方一排横向 chip（全部/风光/儿童/人像）
 * 不做底部弹出面板，也不依赖 onTabItemTap
 */
import { get } from '../../utils/request.js';
import { imgUrl, getAlbumToken } from '../../utils/image.js';
import { LOCK_ICON_SMALL } from '../../utils/lock-icon.js';
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
    /** 卡片中间叠加的金色线框锁（base64 SVG） */
    lockIcon: LOCK_ICON_SMALL,
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
      /*
       * ★ 带上已解锁相册的凭证
       *
       * 为什么：加锁相册在没凭证时，后端不会返回真实封面
       * （设计如此，避免未解锁的人看到封面）。
       * 小程序没有 Cookie，靠这个请求头告诉后端「我已经解锁过了」。
       *
       * 头格式：X-Album-Token: <相册key>:<token>
       * 多个相册用逗号分隔。
       */
      const headers = {};
      const tokens = this.collectAlbumTokens();
      if (tokens) headers['X-Album-Token'] = tokens;

      const data = await get('/api/collections', { auth: false, headers });
      const all = [];

      for (const col of data.collections || []) {
        for (const a of col.albums || []) {
          all.push({
            ...a,
            collectionKey: col.key,
            collectionTitle: col.title,
            /*
             * ★ 必须把 a.key 传给 imgUrl
             *
             * 封面图本身也要鉴权：加锁相册的封面地址虽然由后端返回了，
             * 但去加载这张图时，图片端点同样要校验 token。
             * 不传 albumKey 就拼不上 ?t=xxx，图片会 403，
             * 最终显示成一片空白（看起来像「没有封面」）。
             */
            coverUrl: a.cover ? imgUrl(a.cover, a.key) : '',
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

      /* 记下当前 token 指纹，onShow 时用来判断有没有新的解锁 */
      this._lastTokenSig = this.tokenSignature();
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
   * 收集本机所有已解锁相册的凭证，拼成请求头
   *
   * 格式：key1:token1,key2:token2
   * 没有已解锁的相册就返回空字符串。
   *
   * 为什么一次带上全部：
   *   /api/collections 一次返回所有相册，
   *   头里得覆盖到每一个已解锁的，否则那些相册的封面还是空的。
   */
  collectAlbumTokens() {
    const all = this.data.allAlbums || [];
    const parts = [];

    for (const a of all) {
      if (!a.locked) continue;
      const t = getAlbumToken(a.key);
      if (t) parts.push(a.key + ':' + t);
    }

    return parts.join(',');
  },

  /**
   * 每次显示本页都刷新
   *
   * 从解锁页 / 相册页返回时触发。
   *
   * ★ 为什么要重新拉一次列表
   *   解锁后封面才会返回，不重新请求的话
   *   卡片上一直是锁图标占位，看不到封面。
   */
  onShow() {
    /*
     * 首次进入时 allAlbums 为空，onLoad 里的 loadAlbums 会处理，
     * 这里不重复请求。
     */
    if (!this.data.allAlbums.length) return;

    /*
     * 已有数据 → 说明是从别的页面返回的。
     * 有 token 变化（刚解锁）就重新拉，
     * 没变化就只更新锁图标，省一次请求。
     */
    this.refreshTokenFlags();

    if (this.tokenSignature() !== this._lastTokenSig) {
      this.loadAlbums();
    }
  },

  /** token 状态指纹：用来判断「有没有新的解锁」 */
  tokenSignature() {
    return this.collectAlbumTokens();
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

/**
 * 摄影集页：顶部横向筛选 + 相册双列网格
 *
 * 筛选是第一版的样式：标题下方一排横向 chip（全部/风光/儿童/人像）
 * 不做底部弹出面板，也不依赖 onTabItemTap
 */
import { get } from '../../utils/request.js';
import { imgUrl, getAlbumToken } from '../../utils/image.js';
import { LOCK_ICON_SMALL } from '../../utils/lock-icon.js';
import { IS_DEBUG, ALBUM_TOKEN_PREFIX } from '../../config/index.js';

Page({
  data: {
    /** 全部相册（原始，扁平） */
    allAlbums: [],
    /** 按摄影集分组的相册（用于渲染，和 Web 首页一样） */
    groups: [],
    loading: true,
    statusBarHeight: 20,
    /** 卡片中间叠加的金色线框锁（base64 SVG） */
    lockIcon: LOCK_ICON_SMALL,
    /** 顶部轮播图（小程序独立的一套，3:2，最多 5 张） */
    hero: [],
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

      /*
       * 按摄影集分组（和 Web 首页一样）
       *
       * 直接按 data.collections 的顺序和结构建组，
       * 每个组里放该摄影集的相册，加上序号。
       *
       * 为什么不用扁平的 allAlbums 再自己分组：
       *   后端返回的就是「摄影集 → 相册」的两层结构，
       *   照它走最省事，也天然保证了顺序（collections 按 order 排序）。
       */
      const groups = [];
      for (const col of data.collections || []) {
        const albums = all
          .filter((a) => a.collectionKey === col.key)
          .map((a, i) => ({
            ...a,
            animDelay: i * 40,
            animFrom: i % 2 === 0 ? 'left' : 'right',
            animIn: false,
          }));

        /* 空摄影集不渲染，免得出现只有标题没有卡片的段 */
        if (!albums.length) continue;

        groups.push({
          key: col.key,
          no: String(groups.length + 1).padStart(2, '0'),
          title: col.title || col.key,
          en: col.en || '',
          /*
           * 这一组有多少相册、多少张照片（和 Web 首页显示一致）。
           * 后端 /api/collections 已经算好了，直接用。
           * 相册数用可见相册的实际数量，避免和空组过滤后对不上。
           */
          albumCount: String(albums.length).padStart(2, '0'),
          photoCount: String(
            albums.reduce((n, a) => n + (Number(a.count) || 0), 0)
          ).padStart(2, '0'),
          albums,
        });
      }

      /*
       * 轮播图：小程序独立的一套（/api/collections 返回的 mpHero 字段）。
       * 和 Web 首页轮播是不同的数据源，比例也不同（这边 3:2）。
       *
       * 用 medium 档（1280 宽）而不是 hero 档（3200）：
       *   3:2 卡片在 3x 屏上约 1125 物理像素，medium 就够，
       *   用 hero 档要多下载一倍多的流量。
       */
      const hero = ((data && data.mpHero) || []).map((h) => ({
        path: h.path,
        /* 第 2 个参数传相册 key，加锁相册才能拼上 ?t= 凭证 */
        medium: imgUrl(h.medium || h.thumb || '', h.album),
      }));

      this.setData({ allAlbums: all, groups, loading: false, hero });

      /* 入场动画：等一帧再打 is-in，否则没有过渡效果 */
      setTimeout(() => {
        this.setData({
          groups: this.data.groups.map((g) => ({
            ...g,
            albums: g.albums.map((a) => ({ ...a, animIn: true })),
          })),
        });
      }, 60);

      /*
       * 不再记指纹了。
       *
       * 之前这里存 this.tokenSignature() 给 onShow 比对，
       * 但那个值是在 setData 之后算的（此时 allAlbums 已填好），
       * 而请求发出时 allAlbums 还是空的、根本没带 token。
       * 两者不一致 → 解锁返回后判断成「没变化」→ 封面一直是虚化版。
       *
       * 现在 onShow 直接重新拉列表，不需要指纹了。
       */
    } catch (err) {
      if (IS_DEBUG) console.warn('[collections] 加载失败', err);
      this.setData({ loading: false });
    }
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
   *
   * ★ 不依赖 allAlbums
   *   之前遍历 this.data.allAlbums 只取 locked 的，
   *   但首次加载时 allAlbums 还是空的（列表都还没拉回来），
   *   根本拼不出 token，请求就白发了。
   *
   *   现在直接扫 storage：凡是有 token 的都带上。
   *   多带一个用不上的 token 不会出错，但漏带就会看不到封面。
   */
  collectAlbumTokens() {
    const parts = [];

    /* 相册 key 只允许字母数字和 - _ .，扫到的都是合法 key */
    let keys = [];
    try {
      const info = wx.getStorageInfoSync();
      keys = (info && info.keys) || [];
    } catch (_) {
      return '';
    }

    for (const k of keys) {
      if (!k.startsWith(ALBUM_TOKEN_PREFIX)) continue;
      const albumKey = k.slice(ALBUM_TOKEN_PREFIX.length);
      let token = '';
      try {
        token = wx.getStorageSync(k) || '';
      } catch (_) {
        token = '';
      }
      if (albumKey && token) parts.push(albumKey + ':' + token);
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
     * 已有数据 → 说明是从别的页面返回的（比如刚解锁完、或看完相册回来）。
     *
     * ★ 直接重新拉，不做「指纹没变就跳过」的优化
     *   那个优化出过问题：指纹的计算时机和请求实际发出的 token
     *   不一致，导致解锁后判断成「没变化」，封面一直是虚化版。
     *   一次列表请求很轻，比猜错划算。
     */
    this.loadAlbums();
  },

  onShareAppMessage() {
    return { title: '陈彬拾光集 · 摄影集', path: '/pages/collections/collections' };
  },
});

/**
 * 相册页 —— 两段式
 *
 * 第 1 段：瀑布流照片墙（进入相册先看到这个）
 * 第 2 段：全屏沉浸式浏览（点了某张照片才进）
 *
 * 为什么要照片墙：
 *   直接全屏浏览时，用户不知道相册里有多少张、都长什么样，
 *   也没法跳着看。照片墙给的是「整体印象 + 快速跳转」。
 *
 * 断点续看：
 *   记录用户上次看到第几张，下次进来滚动到那个位置，
 *   并且弹一个「上次看到第 N 张，继续看？」的提示。
 */
import { get, post, del } from '../../utils/request.js';
import { imgUrl } from '../../utils/image.js';
import { EXIF_FIELDS, IS_DEBUG } from '../../config/index.js';

/** 面板吸附阈值（px） */
const PANEL_THRESHOLD = 60;
/** 快速上滑速度阈值（px/ms） */
const FLING_VELOCITY = 0.5;
/** 断点记录的 storage 前缀 */
const PROGRESS_PREFIX = 'album_progress_';

Page({
  data: {
    collection: '',
    album: '',
    albumTitle: '',
    photos: [],

    /* ---------------- 视图模式 ---------------- */
    /** grid = 照片墙 | viewer = 全屏浏览 */
    mode: 'grid',
    /** 全屏浏览里的当前索引 */
    current: 0,
    /** 瀑布流三列 */
    col1: [],
    col2: [],
    col3: [],
    /** 相册封面（管理员设置的，没有则用第一张） */
    coverUrl: '',

    /* ---------------- 断点续看 ---------------- */
    /** 上次看到的索引（-1 = 没有记录） */
    lastSeen: -1,
    /** 断点提示是否显示 */
    showResumeTip: false,

    /* ---------------- EXIF 面板 ---------------- */
    expanded: false,
    dragging: null,
    dragY: 0,
    dragProgress: 0,
    exifList: [],
    noExif: false,

    loading: true,
    error: '',
    statusBarHeight: 20,
  },

  onLoad(query) {
    try {
      const app = getApp();
      const info = (app && app.globalData.sysInfo) || wx.getWindowInfo();
      if (info) {
        this.setData({ statusBarHeight: info.statusBarHeight || 20 });
      }
    } catch (_) {}

    const collection = decodeURIComponent(query.c || '');
    const album = decodeURIComponent(query.a || '');
    const focus = decodeURIComponent(query.focus || '');

    if (!collection || !album) {
      this.setData({ loading: false, error: '缺少参数' });
      return;
    }

    this.setData({ collection, album });
    this.loadPhotos(focus);
  },

  onHide() {
    // 页面隐藏时保存进度
    this.saveProgress();
  },

  onUnload() {
    this.saveProgress();
  },

  /** 拉照片列表 */
  async loadPhotos(focusFile) {
    const { collection, album } = this.data;
    try {
      const data = await get(
        `/api/mp/albums/photos?c=${encodeURIComponent(collection)}&a=${encodeURIComponent(album)}`
      );

      const photos = (data.photos || []).map((p, i) => ({
        ...p,
        index: i,
        thumbUrl: imgUrl(p.thumb, album),
        mediumUrl: imgUrl(p.medium, album),
        originalUrl: imgUrl(p.original, album),
        // 照片墙用的宽高比（后端有 width/height）
        ratio: p.width && p.height ? p.height / p.width : 1.33,
      }));

      if (!photos.length) {
        this.setData({ loading: false, error: '这个相册还没有照片' });
        return;
      }

      // 如果是从收藏/点赞页带 focus 进来的，直接进全屏浏览
      if (focusFile) {
        const found = photos.findIndex(
          (p) => p.file === focusFile || p.path.endsWith(focusFile)
        );
        this.setData({
          photos,
          albumTitle: (data.album && data.album.title) || album,
          coverUrl: this.resolveCover(data.album, photos),
          loading: false,
          mode: 'viewer',
          current: found >= 0 ? found : 0,
        });
        this.updateExif(found >= 0 ? found : 0);
        return;
      }

      // 读上次看到哪
      const lastSeen = this.readProgress();
      const validLast = lastSeen >= 0 && lastSeen < photos.length ? lastSeen : -1;

      const cols = this.splitColumns(photos);

      this.setData({
        photos,
        col1: cols[0],
        col2: cols[1],
        col3: cols[2],
        albumTitle: (data.album && data.album.title) || album,
        coverUrl: this.resolveCover(data.album, photos),
        loading: false,
        mode: 'grid',
        lastSeen: validLast,
        showResumeTip: validLast > 0,
      });
    } catch (err) {
      if (IS_DEBUG) console.warn('[album] 加载失败', err);
      this.setData({
        loading: false,
        error: err.statusCode === 403 ? '该相册需要密码' : '相册加载失败',
      });
    }
  },

  /* ---------------------------------------------------------- 封面 */

  /**
   * 把照片分到 3 列。
   *
   * 不用「轮流分配」（i % 3），因为竖图横图高度差很大，
   * 轮流分会导致某列特别长、某列特别短。
   *
   * 改成「最小高度优先」：每次都放进当前最矮的那列。
   *
   * @param {array} photos
   * @returns {[array, array, array]}
   */
  splitColumns(photos) {
    const cols = [[], [], []];
    // 每列当前累计高度（用相对值，不需要真实像素）
    const heights = [0, 0, 0];

    for (const p of photos) {
      // 找最矮的列
      let minIdx = 0;
      for (let i = 1; i < 3; i += 1) {
        if (heights[i] < heights[minIdx]) minIdx = i;
      }
      cols[minIdx].push(p);
      // ratio = 高 / 宽，宽相同的情况下可以直接累加
      heights[minIdx] += p.ratio || 1.33;
    }

    return cols;
  },

  /**
   * 决定用哪张图做封面。
   *
   * 优先级：
   *   1. 管理员在 Web 控制台设置的封面
   *   2. 没有设置 → 用第一张照片
   *
   * @param {object} albumMeta 后端返回的 album 对象
   * @param {array} photos     照片列表
   */
  resolveCover(albumMeta, photos) {
    if (albumMeta && albumMeta.cover) {
      return imgUrl(albumMeta.cover, this.data.album);
    }
    if (photos && photos.length) {
      // 封面用 medium 档，比 thumb 清晰，又不至于太大
      return photos[0].mediumUrl || photos[0].thumbUrl;
    }
    return '';
  },

  /* ---------------------------------------------------------- 断点续看 */

  /** storage key */
  progressKey() {
    return PROGRESS_PREFIX + this.data.album;
  },

  /** 读上次看到的索引 */
  readProgress() {
    try {
      const v = wx.getStorageSync(this.progressKey());
      return typeof v === 'number' && v >= 0 ? v : -1;
    } catch (_) {
      return -1;
    }
  },

  /** 保存当前进度 */
  saveProgress() {
    if (this.data.mode !== 'viewer') return;
    if (!this.data.photos.length) return;
    try {
      wx.setStorageSync(this.progressKey(), this.data.current);
    } catch (_) {}
  },

  /** 点「继续看」 */
  onResumeTap() {
    const idx = this.data.lastSeen;
    if (idx < 0) return;
    this.enterViewer(idx);
    this.setData({ showResumeTip: false });
  },

  /** 关掉断点提示 */
  onResumeClose() {
    this.setData({ showResumeTip: false });
  },

  /* ---------------------------------------------------------- 照片墙 */

  /** 点照片墙里的某张 → 进全屏浏览 */
  onGridPhotoTap(e) {
    const idx = Number(e.currentTarget.dataset.index);
    if (Number.isNaN(idx)) return;
    this.enterViewer(idx);
  },

  /** 进入全屏浏览 */
  enterViewer(index) {
    this.setData({
      mode: 'viewer',
      current: index,
      expanded: false,
      dragProgress: 0,
    });
    this.updateExif(index);
    this.saveProgress();
  },

  /** 从全屏浏览返回照片墙 */
  backToGrid() {
    this.saveProgress();
    this.setData({ mode: 'grid', expanded: false, dragProgress: 0 });
  },

  /* ---------------------------------------------------------- 更新 EXIF */

  updateExif(idx) {
    const photo = this.data.photos[idx];
    if (!photo || !photo.exif) {
      this.setData({ exifList: [], noExif: true });
      return;
    }

    const exif = photo.exif;
    const list = EXIF_FIELDS.map(([key, label, wide]) => ({
      key,
      label,
      wide,
      value: exif[key] || '',
    })).filter((f) => f.value);

    this.setData({ exifList: list, noExif: list.length === 0 });
  },

  /* ---------------------------------------------------------- 左右滑 */

  onSwiperChange(e) {
    const idx = e.detail.current;
    this.setData({ current: idx });
    this.updateExif(idx);
    this.saveProgress();
  },

  /* ---------------------------------------------------------- 手势 */

  onTouchStart(e) {
    if (e.touches.length !== 1) return;
    this._startY = e.touches[0].clientY;
    this._startX = e.touches[0].clientX;
    this._startTime = Date.now();
    this._moving = false;
    this._isHorizontal = false;
  },

  onTouchMove(e) {
    if (e.touches.length !== 1 || !this._startY) return;

    const dy = e.touches[0].clientY - this._startY;
    const dx = e.touches[0].clientX - this._startX;

    // 横向位移更大 → 翻页手势，不处理面板
    if (!this._moving && Math.abs(dx) > Math.abs(dy) * 1.2 && Math.abs(dx) > 10) {
      this._isHorizontal = true;
      this.setData({ dragging: null });
      return;
    }
    if (this._isHorizontal) return;

    this._moving = true;

    if (!this.data.expanded) {
      if (dy > 0) return;
      const progress = Math.min(1, Math.abs(dy) / PANEL_THRESHOLD);
      this.setData({ dragging: 'up', dragY: dy, dragProgress: progress });
      return;
    }

    if (dy < 0) return;
    const progress = Math.max(0, 1 - dy / PANEL_THRESHOLD);
    this.setData({ dragging: 'down', dragY: dy, dragProgress: progress });
  },

  onTouchEnd(e) {
    const wasHorizontal = this._isHorizontal;
    this._isHorizontal = false;

    if (wasHorizontal || !this._moving) {
      this.setData({ dragging: null, dragY: 0 });
      return;
    }

    const t = e.changedTouches[0];
    const dy = t ? t.clientY - this._startY : 0;
    const dt = Date.now() - this._startTime;
    const velocity = Math.abs(dy) / Math.max(1, dt);

    const fast = velocity > FLING_VELOCITY;
    const far = Math.abs(dy) > PANEL_THRESHOLD;

    if (!this.data.expanded) {
      if ((dy < 0 && far) || (fast && dy < 0)) {
        this.setData({ expanded: true, dragging: null, dragY: 0, dragProgress: 1 });
      } else {
        this.setData({ dragging: null, dragY: 0, dragProgress: 0 });
      }
    } else {
      if ((dy > 0 && far) || (fast && dy > 0)) {
        this.setData({ expanded: false, dragging: null, dragY: 0, dragProgress: 0 });
      } else {
        this.setData({ dragging: null, dragY: 0, dragProgress: 1 });
      }
    }

    this._startY = null;
    this._moving = false;
  },

  /** 收起面板 */
  collapsePanel() {
    this.setData({ expanded: false, dragging: null, dragY: 0, dragProgress: 0 });
  },

  /* ---------------------------------------------------------- 单击 */

  onTapPhoto() {
    if (this.data.expanded) {
      this.collapsePanel();
      return;
    }
    this.openPreview();
  },

  /**
   * 打开原生预览
   *
   * ★ 关键：解决「闪前几张再跳到当前」的问题
   *
   * 问题根源：
   *   wx.previewImage 会先加载 urls[0] 作为初始画面，
   *   然后再切到 current 指定的那张 —— 中间有 1-2 帧闪动。
   *
   * 解决办法：
   *   把当前张排到 urls 的第一位，让 urls[0] === current，
   *   就不存在「从第 1 张跳到第 N 张」的过程。
   *
   * 代价：
   *   预览里只能看到「当前张 → 后面所有张」，看不到之前的。
   *   但用户是从这张点进去的，往回滑本来就是少数行为；
   *   而且比「每次都闪一下」好得多。
   */
  openPreview() {
    const photos = this.data.photos;
    if (!photos.length) return;

    const idx = this.data.current;

    // 当前张排最前，其余按原顺序接在后面
    const ordered = [...photos.slice(idx), ...photos.slice(0, idx)];
    const urls = ordered.map((p) => p.originalUrl);

    wx.previewImage({
      current: urls[0],
      urls,
      fail: (err) => {
        if (IS_DEBUG) console.warn('[album] preview 失败', err);
      },
    });
  },

  /* ---------------------------------------------------------- 长按 */

  onLongPress() {
    const photo = this.data.photos[this.data.current];
    if (!photo) return;

    wx.showActionSheet({
      itemList: ['保存到相册'],
      success: (res) => {
        if (res.tapIndex === 0) this.savePhoto(photo);
      },
    });
  },

  savePhoto(photo) {
    wx.showLoading({ title: '保存中…', mask: true });

    wx.downloadFile({
      url: photo.originalUrl,
      success: (res) => {
        if (res.statusCode !== 200) {
          wx.hideLoading();
          wx.showToast({ title: '下载失败', icon: 'none' });
          return;
        }
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.hideLoading();
            wx.showToast({ title: '已保存到相册' });
          },
          fail: (err) => {
            wx.hideLoading();
            const msg = String(err.errMsg || '');
            if (msg.includes('auth deny') || msg.includes('authorize')) {
              this.askAlbumPermission();
            } else {
              wx.showToast({ title: '保存失败', icon: 'none' });
            }
          },
        });
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '下载失败', icon: 'none' });
      },
    });
  },

  askAlbumPermission() {
    wx.showModal({
      title: '需要相册权限',
      content: '请在设置中允许保存图片到相册',
      confirmText: '去设置',
      success: (r) => {
        if (r.confirm) wx.openSetting();
      },
    });
  },

  /* ---------------------------------------------------------- 点赞 / 收藏 */

  async toggleLike() {
    const idx = this.data.current;
    const photo = this.data.photos[idx];
    if (!photo) return;

    const wasLiked = photo.liked;
    const oldCount = photo.likeCount || 0;

    this.setData({
      [`photos[${idx}].liked`]: !wasLiked,
      [`photos[${idx}].likeCount`]: wasLiked ? Math.max(0, oldCount - 1) : oldCount + 1,
    });

    try {
      const method = wasLiked ? del : post;
      const res = await method('/api/mp/likes', { path: photo.path });
      this.setData({
        [`photos[${idx}].liked`]: res.liked,
        [`photos[${idx}].likeCount`]: res.likeCount,
      });
    } catch (_) {
      this.setData({
        [`photos[${idx}].liked`]: wasLiked,
        [`photos[${idx}].likeCount`]: oldCount,
      });
    }
  },

  async toggleFavorite() {
    const idx = this.data.current;
    const photo = this.data.photos[idx];
    if (!photo) return;

    const wasFav = photo.favorited;
    this.setData({ [`photos[${idx}].favorited`]: !wasFav });

    try {
      const method = wasFav ? del : post;
      const res = await method('/api/mp/favorites', { path: photo.path });
      this.setData({ [`photos[${idx}].favorited`]: res.favorited });
      wx.showToast({
        title: res.favorited ? '已收藏' : '已取消收藏',
        icon: 'none',
        duration: 1200,
      });
    } catch (_) {
      this.setData({ [`photos[${idx}].favorited`]: wasFav });
    }
  },

  /* ---------------------------------------------------------- 返回 */

  goBack() {
    // 全屏浏览时，先回照片墙
    if (this.data.mode === 'viewer') {
      this.backToGrid();
      return;
    }
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack();
    } else {
      wx.switchTab({ url: '/pages/collections/collections' });
    }
  },

  onShareAppMessage() {
    const photo = this.data.mode === 'viewer' ? this.data.photos[this.data.current] : null;
    return {
      title: `${this.data.albumTitle} · 陈彬拾光集`,
      path:
        `/pages/album/album?c=${encodeURIComponent(this.data.collection)}` +
        `&a=${encodeURIComponent(this.data.album)}` +
        (photo ? `&focus=${encodeURIComponent(photo.file)}` : ''),
      imageUrl: photo ? photo.thumbUrl : '',
    };
  },
});

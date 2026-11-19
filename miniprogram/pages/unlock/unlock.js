/**
 * 相册解锁页
 *
 * 输密码 → 后端验证 → 存 album token 到 storage → 进相册
 *
 * 注意：相册 token 是独立的一套（album_sessions 表），
 * 与用户登录 token 无关。
 */
import { post } from '../../utils/request.js';
import { setAlbumToken } from '../../utils/image.js';
import { BASE_URL, IS_DEBUG } from '../../config/index.js';

/**
 * 金色线框锁图标（SVG 转 base64）
 *
 * 为什么不用 emoji 🔒：
 *   它是彩色实心图形，没法控制线条粗细和颜色，
 *   放在大面积暗底上偏廉价。用户要的是线框风格。
 *
 * 为什么用 base64 而不是内联 svg：
 *   小程序 WXML 不支持 <svg> 标签，只能走 image。
 *
 * 为什么硬编码而不是运行时转换：
 *   小程序里 btoa / Buffer 都不可靠，
 *   这串 base64 是构建时算好的，直接写死最稳。
 *
 * 原始 SVG（48×56，金色 #c9a86a，1.6px 线宽）：
 *   <rect x=4 y=24 w=40 h=28 rx=4/>
 *   <path d="M13 24V14a11 11 0 0 1 22 0v10"/>
 *   <circle cx=24 cy=37 r=3/>
 *   <path d="M24 40v5"/>
 */
const LOCK_ICON =
  'data:image/svg+xml;base64,' +
  'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA1NiIg' +
  'ZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYzlhODZhIiBzdHJva2Utd2lkdGg9IjEuNiIgc3Ryb2tlLWxpbmVj' +
  'YXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cmVjdCB4PSI0IiB5PSIyNCIgd2lk' +
  'dGg9IjQwIiBoZWlnaHQ9IjI4IiByeD0iNCIvPgogIDxwYXRoIGQ9Ik0xMyAyNFYxNGExMSAxMSAwIDAg' +
  'MSAyMiAwdjEwIi8+CiAgPGNpcmNsZSBjeD0iMjQiIGN5PSIzNyIgcj0iMyIvPgogIDxwYXRoIGQ9Ik0y' +
  'NCA0MHY1Ii8+Cjwvc3ZnPg==';

Page({
  data: {
    collection: '',
    album: '',
    albumTitle: '',
    password: '',
    error: '',
    submitting: false,
    /** 锁定剩余秒数 */
    retryAfter: 0,
    /** 锁定提示文案 */
    lockText: '',
    statusBarHeight: 20,
    /** 抖动动画 */
    shake: false,
    /** 金色线框锁图标（base64 SVG，见文件顶部常量） */
    lockIcon: LOCK_ICON,
  },

  onLoad(query) {
    let statusBarHeight = 20;
    try {
      const app = getApp();
      const info = (app && app.globalData.sysInfo) || wx.getWindowInfo();
      if (info && info.statusBarHeight) statusBarHeight = info.statusBarHeight;
    } catch (_) {}

    this.setData({
      collection: decodeURIComponent(query.c || ''),
      album: decodeURIComponent(query.a || ''),
      albumTitle: decodeURIComponent(query.title || ''),
      statusBarHeight,
    });

    // 没传标题的话，从 collections 接口补
    if (!this.data.albumTitle) {
      this.fetchTitle();
    }
  },

  async fetchTitle() {
    try {
      const r = await new Promise((resolve) => {
        wx.request({
          url: BASE_URL + '/api/collections',
          method: 'GET',
          success: (res) => resolve(res.data),
          fail: () => resolve(null),
        });
      });
      if (!r) return;
      for (const c of r.collections || []) {
        for (const a of c.albums || []) {
          if (a.key === this.data.album) {
            this.setData({ albumTitle: a.title });
            return;
          }
        }
      }
    } catch (_) {}
  },

  onInput(e) {
    this.setData({ password: e.detail.value, error: '' });
  },

  async onSubmit() {
    if (this.data.submitting) return;

    const password = (this.data.password || '').trim();
    if (!password) {
      this.setData({ error: '请输入密码' });
      return;
    }

    this.setData({ submitting: true, error: '' });

    try {
      /*
       * ★ 必须调小程序自己的接口，不能调 Web 端的。
       *
       * /api/albums/:key/unlock 是 Web 端接口：
       *   验证通过后种 Cookie，返回 { ok, locked, expiresIn }
       *   没有 token 字段 —— 小程序拿不到 Cookie，也就无法取图。
       *
       * /api/mp/albums/unlock 是给小程序用的：
       *   返回 { ok, locked, token, expiresIn }
       *   小程序把 token 存起来，拼在图片 URL 的 ?t= 参数上。
       */
      const res = await post('/api/mp/albums/unlock', {
        album: this.data.album,
        password,
      });

      if (res.token) {
        setAlbumToken(this.data.album, res.token);
      } else {
        /*
         * 没拿到 token 说明后端返回异常。
         * 这种情况不要静默跳转，否则用户进去看到「还没有照片」会更困惑。
         */
        this.setData({
          submitting: false,
          error: '解锁异常，请重试',
        });
        return;
      }

      // 成功 → 进相册
      wx.redirectTo({
        url:
          `/pages/album/album?c=${encodeURIComponent(this.data.collection)}` +
          `&a=${encodeURIComponent(this.data.album)}`,
      });
    } catch (err) {
      const body = err.body || {};
      const retryAfter = Number(body.retryAfter || 0);

      this.setData({
        submitting: false,
        shake: true,
        error: err.message || '密码不正确',
        retryAfter,
      });

      if (IS_DEBUG) console.warn('[unlock] 失败', err.message, retryAfter);

      // 抖动动画
      setTimeout(() => this.setData({ shake: false }), 400);

      // 锁定中：倒计时
      if (retryAfter > 0) {
        this.startCountdown(retryAfter);
      }
    }
  },

  /** 锁定倒计时 */
  startCountdown(seconds) {
    this.clearCountdown();
    this.setData({ retryAfter: seconds, lockText: this.formatLock(seconds) });

    this._timer = setInterval(() => {
      const left = this.data.retryAfter - 1;
      if (left <= 0) {
        this.clearCountdown();
        this.setData({ retryAfter: 0, lockText: '', error: '' });
        return;
      }
      this.setData({ retryAfter: left, lockText: this.formatLock(left) });
    }, 1000);
  },

  /** 把剩余秒数格式化成可读文案 */
  formatLock(seconds) {
    if (seconds <= 0) return '';
    if (seconds > 60) {
      return `已锁定，请 ${Math.ceil(seconds / 60)} 分钟后再试`;
    }
    return `已锁定，请 ${seconds} 秒后再试`;
  },

  clearCountdown() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  },

  onUnload() {
    this.clearCountdown();
  },

  goBack() {
    wx.navigateBack();
  },

  /** 提示文案 */
  lockText(seconds) {
    if (seconds <= 0) return '';
    const min = Math.ceil(seconds / 60);
    return `已锁定，请 ${min} 分钟后再试`;
  },
});

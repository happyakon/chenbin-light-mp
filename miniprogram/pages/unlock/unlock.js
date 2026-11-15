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
      const res = await post(
        `/api/albums/${encodeURIComponent(this.data.album)}/unlock`,
        { password },
        { silent: true }
      );

      if (res.albumToken) {
        setAlbumToken(this.data.album, res.albumToken);
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

/**
 * 关于页
 *
 * 内容全部来自 Web 控制台配置。
 * 控制台关闭时，这个 tab 不会出现；直接访问则显示「未启用」。
 */
import { get } from '../../utils/request.js';
import { imgUrl } from '../../utils/image.js';
import { IS_DEBUG } from '../../config/index.js';

Page({
  data: {
    enabled: false,
    about: null,
    avatarUrl: '',
    version: 'v1.0.0',
    statusBarHeight: 20,
    loading: true,
  },

  onLoad() {
    try {
      const app = getApp();
      const info = (app && app.globalData.sysInfo) || wx.getWindowInfo();
      if (info && info.statusBarHeight) {
        this.setData({ statusBarHeight: info.statusBarHeight });
      }
    } catch (_) {}
  },

  onShow() {
    this.load();
  },

  async load() {
    try {
      const data = await get('/api/mp/config', { auth: false, silent: true });
      const about = data.about || null;
      this.setData({
        enabled: Boolean(data.aboutEnabled) && Boolean(about),
        about,
        avatarUrl: about && about.avatar ? imgUrl(about.avatar) : '',
        loading: false,
      });
    } catch (err) {
      if (IS_DEBUG) console.warn('[about] 加载失败', err);
      this.setData({ enabled: false, loading: false });
    }
  },

  /** 点联系方式 → 复制 */
  onContactTap(e) {
    const value = e.currentTarget.dataset.value;
    if (!value) return;
    wx.setClipboardData({
      data: value,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'none', duration: 1200 });
      },
    });
  },

  onShareAppMessage() {
    return { title: '陈彬拾光集 · 我的摄影展', path: '/pages/index/index' };
  },
});

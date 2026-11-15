/**
 * 我的：我的收藏 / 我的点赞
 *
 * 没有「设置头像昵称」——静默登录，不索取头像昵称。
 */
import { get } from '../../utils/request.js';

Page({
  data: {
    favCount: null,
    likeCount: null,
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
  },

  onShow() {
    this.loadCounts();
  },

  /** 拉收藏和点赞的数量 */
  async loadCounts() {
    try {
      const [fav, like] = await Promise.all([
        get('/api/mp/favorites', { silent: true }).catch(() => null),
        get('/api/mp/likes', { silent: true }).catch(() => null),
      ]);
      this.setData({
        favCount: fav ? (fav.photos || []).length : null,
        likeCount: like ? (like.photos || []).length : null,
      });
    } catch (_) {}
  },

  goFavorites() {
    wx.navigateTo({ url: '/pages/favorites/favorites' });
  },

  goLikes() {
    wx.navigateTo({ url: '/pages/likes/likes' });
  },

  onShareAppMessage() {
    return { title: '陈彬拾光集 · 我的摄影展', path: '/pages/index/index' };
  },
});

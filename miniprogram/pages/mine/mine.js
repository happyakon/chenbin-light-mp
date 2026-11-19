/**
 * 我的：资料 + 收藏 + 点赞
 *
 * 资料可以自己设置（头像、昵称）。
 *
 * 为什么不用 wx.getUserProfile：
 *   微信 2022 年起收紧了该接口，普通小程序调用只能拿到
 *   「微信用户」和灰色默认头像，拿不到真实资料。
 *   所以改成用户自己上传头像、自己填昵称。
 */
import { get } from '../../utils/request.js';
import { BASE_URL } from '../../config/index.js';

Page({
  data: {
    favCount: null,
    likeCount: null,
    statusBarHeight: 20,

    /* ---------------- 资料 ---------------- */
    nickname: '',
    avatar: '',
    /** 头像完整 URL（后端只返回相对路径） */
    avatarFull: '',
    /** 没昵称时的默认名，如「用户 #12」 */
    defaultName: '',
    /** 头像占位用的首字母 */
    initial: '',
  },

  onLoad() {
    try {
      const app = getApp();
      const info = (app && app.globalData.sysInfo) || wx.getWindowInfo();
      if (info && info.statusBarHeight) {
        this.setData({ statusBarHeight: info.statusBarHeight });
      }
    } catch (_) {}

    this.loadProfile();
  },

  onShow() {
    this.loadCounts();
    /* 从编辑页返回时刷新资料 */
    this.loadProfile();
  },

  /* ---------------------------------------------------------- 资料 */

  async loadProfile() {
    try {
      const data = await get('/api/mp/profile', { silent: true });
      const u = (data && data.user) || {};

      this.applyProfile(u);
    } catch (_) {
      /* 没登录或网络问题，保持原样 */
    }
  },

  /**
   * 把后端返回的资料写进 data
   * @param {{nickname:string, avatar:string, defaultName:string}} u
   */
  applyProfile(u) {
    const nickname = u.nickname || '';
    const avatar = u.avatar || '';
    const defaultName = u.defaultName || '';

    /*
     * 头像占位首字母：
     *   有昵称用昵称第一个字，没有就用默认名里的数字。
     */
    let initial = '';
    if (nickname) {
      initial = nickname.slice(0, 1);
    } else if (defaultName) {
      initial = defaultName.replace(/[^0-9]/g, '') || '#';
    } else {
      initial = '#';
    }

    this.setData({
      nickname,
      avatar,
      avatarFull: avatar ? BASE_URL + avatar : '',
      defaultName,
      initial,
    });
  },

  /** 头像加载失败（文件被删等），回退到占位 */
  onAvatarError() {
    this.setData({ avatar: '', avatarFull: '' });
  },

  goEditProfile() {
    wx.navigateTo({ url: '/pages/profile/profile' });
  },

  /* ---------------------------------------------------------- 数量 */

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

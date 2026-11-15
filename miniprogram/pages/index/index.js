/**
 * 首页 —— 介绍页
 *
 * 内容来源优先级：
 *   1. 后台配置（/api/mp/config 返回的 home 字段）
 *   2. 配置为空 → 用 WXML 里的默认文案
 *
 * ★ 关键设计：WXML 里的文字是「默认值」，JS 拿到配置后才覆盖。
 *   这样即使接口挂了，页面也正常显示，不会空白。
 */
import { get } from '../../utils/request.js';
import { imgUrl } from '../../utils/image.js';
import { IS_DEBUG } from '../../config/index.js';

/** 默认文案（与 WXML 里写的一致） */
const DEFAULTS = {
  title: '陈彬拾光集',
  subtitle: '我将去往山川湖海，在天地之间拾光。',
  cardTitle: '拾光者',
  cardBody: '镜头所至，定格风、云、山野与河川。',
};

Page({
  data: {
    statusBarHeight: 20,

    /** 背景图 URL（空则用 CSS 绘制的默认山景） */
    bgImage: '',
    /** 是否有背景图 */
    hasBg: false,

    /** 文案（初始 = 默认值，接口返回后覆盖） */
    title: DEFAULTS.title,
    subtitle: DEFAULTS.subtitle,
    cardTitle: DEFAULTS.cardTitle,
    cardBody: DEFAULTS.cardBody,
  },

  onLoad() {
    try {
      const app = getApp();
      const info = (app && app.globalData.sysInfo) || wx.getWindowInfo();
      if (info && info.statusBarHeight) {
        this.setData({ statusBarHeight: info.statusBarHeight });
      }
    } catch (_) {}

    this.loadConfig();
  },

  /** 拉后台配置 */
  async loadConfig() {
    try {
      const data = await get('/api/mp/config', { auth: false, silent: true });
      const home = data.home || {};

      const update = {};

      // 背景图：有配置才用，URL 拼上域名
      if (home.bgImage) {
        update.bgImage = imgUrl(home.bgImage);
        update.hasBg = true;
      }

      // 文案：有值才覆盖默认
      if (home.title) update.title = home.title;
      if (home.subtitle) update.subtitle = home.subtitle;
      if (home.cardTitle) update.cardTitle = home.cardTitle;
      if (home.cardBody) update.cardBody = home.cardBody;

      if (Object.keys(update).length) {
        this.setData(update);
      }

      if (IS_DEBUG) {
        console.log('[index] 配置已加载, 背景图:', home.bgImage || '无（用默认山景）');
      }
    } catch (err) {
      // 失败就用默认文案，什么都不做
      if (IS_DEBUG) console.warn('[index] 拉配置失败，用默认文案', err.message);
    }
  },

  /** 点任意位置 → 进摄影集 */
  onTapScreen() {
    wx.switchTab({
      url: '/pages/collections/collections',
      fail: (err) => {
        console.warn('[index] 跳转失败', err);
      },
    });
  },

  onShareAppMessage() {
    return { title: '陈彬拾光集 · 我的摄影展', path: '/pages/index/index' };
  },

  onShareTimeline() {
    return { title: '陈彬拾光集 · 我的摄影展' };
  },
});

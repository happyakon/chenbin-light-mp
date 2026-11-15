/**
 * 小程序入口
 *
 * 启动时做的事：
 *   1. 静默登录（不弹窗）
 *   2. 拉全局配置（关于页是否启用）
 *
 * 两件事并行，都不阻塞首屏渲染。
 */
import { ensureLogin } from './utils/auth.js';
import { get } from './utils/request.js';
import { IS_DEBUG } from './config/index.js';

App({
  globalData: {
    /** 关于页是否启用 */
    aboutEnabled: false,
    /** 关于页内容 */
    about: null,
    /** 轮播图列表（首页用） */
    hero: [],
    /** 登录是否就绪 */
    loginReady: false,
    /** 配置是否就绪 */
    configReady: false,
    /** 系统信息（状态栏高度等） */
    sysInfo: null,
  },

  onLaunch() {
    // 系统信息
    try {
      this.globalData.sysInfo = wx.getWindowInfo
        ? wx.getWindowInfo()
        : wx.getSystemInfoSync();
    } catch (_) {}

    // 并行：登录 + 拉配置
    this.bootstrap();
  },

  async bootstrap() {
    // 登录（失败不阻塞，浏览功能不需要登录也能用）
    ensureLogin()
      .then(() => {
        this.globalData.loginReady = true;
        if (IS_DEBUG) console.log('[app] 登录就绪');
      })
      .catch((err) => {
        if (IS_DEBUG) console.warn('[app] 登录失败:', err.message);
      });

    // 拉配置（关于页开关 + 轮播图）
    try {
      const data = await get('/api/mp/config', { auth: false, silent: true });
      this.globalData.aboutEnabled = Boolean(data.aboutEnabled);
      this.globalData.about = data.about || null;
      this.globalData.hero = data.hero || [];
      this.globalData.configReady = true;
      if (IS_DEBUG) {
        console.log('[app] 配置就绪, 关于页:', this.globalData.aboutEnabled, '轮播图:', this.globalData.hero.length);
      }
      // 通知订阅者（tabBar / 关于页）
      this.notifyConfigReady();
    } catch (err) {
      if (IS_DEBUG) console.warn('[app] 拉配置失败:', err.message);
      // 失败时默认不显示关于页，避免点了进去是空的
      this.globalData.aboutEnabled = false;
      this.globalData.configReady = true;
      this.notifyConfigReady();
    }
  },

  /** 配置就绪的回调集合 */
  _configCallbacks: [],

  /** 注册配置就绪回调（已就绪则立即执行） */
  onConfigReady(cb) {
    if (this.globalData.configReady) {
      cb();
    } else {
      this._configCallbacks.push(cb);
    }
  },

  notifyConfigReady() {
    const cbs = this._configCallbacks.slice();
    this._configCallbacks.length = 0;
    cbs.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        if (IS_DEBUG) console.warn('[app] config callback error', e);
      }
    });
  },

  /** 重新拉配置（从关于页返回时用） */
  refreshConfig() {
    return this.bootstrap();
  },
});

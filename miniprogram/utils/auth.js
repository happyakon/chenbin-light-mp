/**
 * 静默登录
 *
 * 流程：
 *   wx.login() → code → 后端换 token → 存 storage
 *
 * 用户全程无感，不弹任何授权窗。
 * 不索取头像昵称（见 PRD 3.3 节）。
 */
import { BASE_URL, TOKEN_KEY, IS_DEBUG } from '../config/index.js';

/** 登录中的 Promise，避免并发触发多次登录 */
let loginPromise = null;

/** 读 token */
export function getToken() {
  try {
    return wx.getStorageSync(TOKEN_KEY) || '';
  } catch (_) {
    return '';
  }
}

/** 清 token */
export function clearToken() {
  try {
    wx.removeStorageSync(TOKEN_KEY);
  } catch (_) {}
}

/**
 * 登录（幂等）
 * @returns {Promise<string>} token
 */
export function relogin() {
  if (loginPromise) return loginPromise;

  loginPromise = new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        if (!res.code) {
          reject(new Error('wx.login 没有返回 code'));
          return;
        }
        wx.request({
          url: BASE_URL + '/api/mp/login',
          method: 'POST',
          header: { 'Content-Type': 'application/json' },
          data: { code: res.code },
          timeout: 15000,
          success: (r) => {
            if (r.statusCode === 200 && r.data && r.data.token) {
              try {
                wx.setStorageSync(TOKEN_KEY, r.data.token);
              } catch (_) {}
              if (IS_DEBUG) console.log('[auth] 登录成功');
              resolve(r.data.token);
            } else {
              reject(new Error((r.data && r.data.error) || '登录失败'));
            }
          },
          fail: (err) => reject(new Error(err.errMsg || '登录请求失败')),
        });
      },
      fail: (err) => reject(new Error(err.errMsg || 'wx.login 失败')),
    });
  }).finally(() => {
    loginPromise = null;
  });

  return loginPromise;
}

/**
 * 确保已登录（有 token 就直接返回，没有就登录）
 * @returns {Promise<string>}
 */
export function ensureLogin() {
  const token = getToken();
  if (token) return Promise.resolve(token);
  return relogin();
}

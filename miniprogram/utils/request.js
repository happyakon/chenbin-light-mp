/**
 * 网络请求封装
 *
 * 关键点：
 *   1. 自动带 Authorization: Bearer <token>
 *   2. 401 自动重新登录并重试一次
 *   3. 统一错误提示
 *   4. 所有请求串行化，避免并发登录
 */
import { BASE_URL, TOKEN_KEY, IS_DEBUG } from '../config/index.js';
import { clearToken, getToken, relogin } from './auth.js';

/** 正在进行的重登录 Promise，避免并发触发多次登录 */
let reloginPromise = null;

/**
 * 发请求
 * @param {object} options
 * @param {string} options.url      相对路径，如 /api/collections
 * @param {string} [options.method] GET / POST / PUT / DELETE
 * @param {object} [options.data]   请求体（JSON）
 * @param {boolean} [options.auth]  是否需要带 token，默认 true
 * @param {boolean} [options.silent] 出错时不弹 toast，默认 false
 * @param {boolean} [options.retry]  内部用：401 后是否已重试过
 */
export function request(options) {
  const {
    url,
    method = 'GET',
    data,
    auth = true,
    silent = false,
    retry = false,
  } = options;

  return new Promise((resolve, reject) => {
    const header = { 'Content-Type': 'application/json' };

    if (auth) {
      const token = getToken();
      if (token) header.Authorization = 'Bearer ' + token;
    }

    wx.request({
      url: BASE_URL + url,
      method,
      data,
      header,
      timeout: 15000,
      success: async (res) => {
        const { statusCode, data: body } = res;

        if (statusCode >= 200 && statusCode < 300) {
          resolve(body);
          return;
        }

        // 401：token 失效，重新登录后重试一次
        if (statusCode === 401 && auth && !retry) {
          try {
            if (!reloginPromise) {
              reloginPromise = (async () => {
                clearToken();
                await relogin();
              })().finally(() => {
                reloginPromise = null;
              });
            }
            await reloginPromise;

            const result = await request({ ...options, retry: true });
            resolve(result);
            return;
          } catch (e) {
            reject(normalizeError('登录失效，请重启小程序'));
            return;
          }
        }

        const msg = (body && body.error) || '请求失败 ' + statusCode;
        if (!silent) {
          wx.showToast({ title: msg, icon: 'none', duration: 2000 });
        }
        if (IS_DEBUG) {
          console.warn('[request]', method, url, statusCode, body);
        }
        reject(normalizeError(msg, statusCode, body));
      },

      fail: (err) => {
        const msg = '网络不太好，请检查网络后重试';
        if (!silent) {
          wx.showToast({ title: msg, icon: 'none', duration: 2000 });
        }
        if (IS_DEBUG) {
          console.warn('[request] fail', method, url, err);
        }
        reject(normalizeError(msg));
      },
    });
  });
}

function normalizeError(message, statusCode, body) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.body = body;
  return err;
}

/* ------------------------------------------------------------ 便捷方法 */

export const get = (url, opts = {}) => request({ ...opts, url, method: 'GET' });
export const post = (url, data, opts = {}) =>
  request({ ...opts, url, method: 'POST', data });
export const put = (url, data, opts = {}) =>
  request({ ...opts, url, method: 'PUT', data });
export const del = (url, data, opts = {}) =>
  request({ ...opts, url, method: 'DELETE', data });

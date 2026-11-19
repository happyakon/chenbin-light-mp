/**
 * 图片 URL 处理
 *
 * 后端返回的是相对路径（/img/...?tier=thumb），
 * 小程序要拼上域名，加锁相册还要带 token。
 */
import { BASE_URL, ALBUM_TOKEN_PREFIX } from '../config/index.js';

/**
 * 拼出完整图片 URL
 * @param {string} relPath  相对路径，如 /img/landscape/scenery/a.jpg?tier=thumb
 * @param {string} [albumKey] 相册 key，有值时会带上相册 token
 * @returns {string}
 */
export function imgUrl(relPath, albumKey) {
  if (!relPath) return '';
  // 已经是完整 URL 就直接返回
  if (/^https?:\/\//.test(relPath)) return relPath;

  let url = BASE_URL + relPath;

  if (albumKey) {
    const token = getAlbumToken(albumKey);
    if (token) {
      url += (url.includes('?') ? '&' : '?') + 't=' + token;
    }
  }
  return url;
}

/** 读相册 token */
export function getAlbumToken(albumKey) {
  try {
    return wx.getStorageSync(ALBUM_TOKEN_PREFIX + albumKey) || '';
  } catch (_) {
    return '';
  }
}

/** 存相册 token */
export function setAlbumToken(albumKey, token) {
  try {
    wx.setStorageSync(ALBUM_TOKEN_PREFIX + albumKey, token);
  } catch (_) {}
}

/** 清相册 token */
export function clearAlbumToken(albumKey) {
  try {
    wx.removeStorageSync(ALBUM_TOKEN_PREFIX + albumKey);
  } catch (_) {}
}

/* ------------------------------------------------------------ 限定列表 */

/**
 * 「只看这几张」的临时列表
 *
 * 用途：从收藏 / 点赞页点开某张图时，左右滑动应该只在
 *       收藏的那些图之间切换，而不是整个相册。
 *
 * 为什么用 storage 传而不是 URL 参数：
 *   收藏可能有几十上百张，路径拼进 URL 会超长
 *   （小程序 URL 长度有限制，且编码后更长）。
 *
 * 为什么只存一次：
 *   读一次就删。避免下次正常进相册时误用上次的列表。
 */
const PENDING_LIST_KEY = 'pending_photo_list';

/**
 * 存一个待浏览的列表
 * @param {object} opts
 * @param {string[]} opts.paths   照片 path 列表（按显示顺序）
 * @param {string} opts.focus     打开时定位到哪一张
 * @param {string} opts.title     页面标题（如「我的收藏」）
 */
export function setPendingList({ paths, focus, title }) {
  try {
    wx.setStorageSync(PENDING_LIST_KEY, { paths, focus, title });
  } catch (_) {}
}

/**
 * 取出并清空待浏览列表
 * @returns {{paths:string[], focus:string, title:string}|null}
 */
export function takePendingList() {
  try {
    const v = wx.getStorageSync(PENDING_LIST_KEY);
    wx.removeStorageSync(PENDING_LIST_KEY);
    if (!v || !Array.isArray(v.paths) || !v.paths.length) return null;
    return v;
  } catch (_) {
    return null;
  }
}

/**
 * 给照片对象的三个 URL 字段批量拼域名
 * @param {object} photo 后端返回的照片对象
 * @param {string} [albumKey]
 */
export function normalizePhoto(photo, albumKey) {
  if (!photo) return photo;
  return {
    ...photo,
    thumbUrl: imgUrl(photo.thumb, albumKey),
    mediumUrl: imgUrl(photo.medium, albumKey),
    originalUrl: imgUrl(photo.original, albumKey),
  };
}

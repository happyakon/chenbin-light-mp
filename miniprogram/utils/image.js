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

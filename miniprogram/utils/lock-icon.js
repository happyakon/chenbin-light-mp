/**
 * 加密相册的视觉素材
 *
 * 为什么不用 emoji 🔒：
 *   彩色实心图形，改不了线条粗细和颜色，
 *   在大面积暗底上显廉价。需要金色线框风格。
 *
 * 为什么用 base64 而不是内联 svg：
 *   小程序 WXML 不支持 <svg> 标签，只能走 <image>。
 *
 * 为什么硬编码而不是运行时转换：
 *   小程序里 btoa / Buffer 都不可靠，
 *   这两串是构建时算好的，直接写死最稳。
 */

/**
 * 大号锁（解锁页用）
 * 原始 SVG：viewBox 48×56，金色 #c9a86a，线宽 1.6
 *   <rect x=4 y=24 w=40 h=28 rx=4/>
 *   <path d="M13 24V14a11 11 0 0 1 22 0v10"/>
 *   <circle cx=24 cy=37 r=3/>
 *   <path d="M24 40v5"/>
 */
export const LOCK_ICON_LARGE =
  'data:image/svg+xml;base64,' +
  'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA1NiIg' +
  'ZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYzlhODZhIiBzdHJva2Utd2lkdGg9IjEuNiIgc3Ryb2tlLWxpbmVj' +
  'YXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cmVjdCB4PSI0IiB5PSIyNCIgd2lk' +
  'dGg9IjQwIiBoZWlnaHQ9IjI4IiByeD0iNCIvPgogIDxwYXRoIGQ9Ik0xMyAyNFYxNGExMSAxMSAwIDAg' +
  'MSAyMiAwdjEwIi8+CiAgPGNpcmNsZSBjeD0iMjQiIGN5PSIzNyIgcj0iMyIvPgogIDxwYXRoIGQ9Ik0y' +
  'NCA0MHY1Ii8+Cjwvc3ZnPg==';

/**
 * 小号锁（相册卡片中间用）
 * 原始 SVG：viewBox 24×28，线宽 1.8（小尺寸下线要相对粗一点才看得清）
 */
export const LOCK_ICON_SMALL =
  'data:image/svg+xml;base64,' +
  'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyOCIg' +
  'ZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYzlhODZhIiBzdHJva2Utd2lkdGg9IjEuOCIgc3Ryb2tlLWxpbmVj' +
  'YXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cmVjdCB4PSIzIiB5PSIxMiIgd2lk' +
  'dGg9IjE4IiBoZWlnaHQ9IjEzIiByeD0iMi41Ii8+CiAgPHBhdGggZD0iTTcuNSAxMlY3LjVhNC41IDQu' +
  'NSAwIDAgMSA5IDBWMTIiLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjE4IiByPSIxLjQiLz4KICA8cGF0' +
  'aCBkPSJNMTIgMTkuNHYyLjIiLz4KPC9zdmc+';

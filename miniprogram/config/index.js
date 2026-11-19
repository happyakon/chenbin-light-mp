/**
 * 全局配置 —— 开发 / 生产环境切换
 *
 * ★ 本地开发：用 ENV = 'local'
 * ★ 体验版 / 正式版：用 ENV = 'prod'
 *
 * 为什么要这样：
 *   小程序只能请求 HTTPS + 已备案域名，
 *   但本地开发时得用局域网 IP 或公网 IP 调试。
 *   开发者工具里可以勾「不校验合法域名」绕过限制。
 */
const ENV = 'prod';

const CONFIG = {
  local: {
    // 本地开发：后端跑在电脑上，手机和电脑连同一 WiFi
    // 用局域网 IP，不要用 localhost（手机访问不到）
    baseUrl: 'http://39.107.230.253:3000',
    // 域名校验：开发者工具里可以关，真机不行
    debug: true,
  },

  prod: {
    /*
     * 生产：用 photo-api 子域而不是 photo。
     *
     * 为什么分开：
     *   · 微信要求小程序用独立域名，方便后台配置
     *   · 分开后能在 Caddy 日志里单独统计小程序流量
     *   · 主站 photo. 只管网页，职责更清晰
     *
     * 两个域名反代到同一个后端（127.0.0.1:3000）。
     */
    baseUrl: 'https://photo-api.landshot.cn',
    debug: false,
  },
};

/** 当前环境的配置 */
export const env = CONFIG[ENV];

/** 接口基地址 */
export const BASE_URL = env.baseUrl;

/** 是否开发模式 */
export const IS_DEBUG = env.debug;

/** 环境标识（用于日志） */
export const ENV_NAME = ENV;

/* ------------------------------------------------------------------ 常量 */

/** 当前用户 token 在 storage 里的 key */
export const TOKEN_KEY = 'auth_token';

/** 首页动画上次播放时间 在 storage 里的 key */
export const INDEX_ANIM_KEY = 'index_anim_last_at';

/** 相册 token 的 storage key 前缀 */
export const ALBUM_TOKEN_PREFIX = 'album_token_';

/** 首页动画防抖间隔（毫秒） */
export const INDEX_ANIM_DEBOUNCE = 5000;

/** 首页动画各阶段时长（毫秒） */
export const ANIM = {
  welcomeIn: 400,      // 欢迎语淡入
  welcomeHold: 500,    // 欢迎语停留
  flyStart: 900,       // 图片开始飞入
  flyStagger: 80,      // 每张图延迟
  flyDuration: 900,    // 单张飞入时长
  guideDelay: 300,     // 飞入完成后多久出现引导字
};

/** 摄影集筛选的 chip 配置 */
export const COLLECTION_TABS = [
  { key: '', label: '全部' },
  { key: 'landscape', label: '风光摄影集' },
  { key: 'children', label: '儿童摄影集' },
  { key: 'portrait', label: '人像摄影集' },
];

/** EXIF 字段配置（与 Web 端一致） */
export const EXIF_FIELDS = [
  ['camera', '相机', true],
  ['lens', '镜头', true],
  ['aperture', '光圈', false],
  ['shutter', '快门', false],
  ['iso', 'ISO', false],
  ['focal', '焦距', false],
  ['date', '拍摄时间', false],
];

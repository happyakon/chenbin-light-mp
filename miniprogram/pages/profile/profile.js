/**
 * 完善资料：头像 + 昵称
 *
 * 头像上传用 wx.chooseMedia（新接口）而不是 wx.chooseImage（已废弃）。
 *
 * 注意：
 *   input 的 type="nickname" 是微信 2023 年加的能力，
 *   可以调起微信的「使用微信昵称」快捷填写。
 *   但它不强制，用户仍可手动输入。
 */
import { get, put } from '../../utils/request.js';
import { BASE_URL, TOKEN_KEY } from '../../config/index.js';

Page({
  data: {
    statusBarHeight: 20,
    nickname: '',
    avatar: '',
    avatarFull: '',
    defaultName: '用户',
    initial: '#',
    saving: false,
    uploading: false,
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

  async loadProfile() {
    try {
      const data = await get('/api/mp/profile');
      this.applyProfile((data && data.user) || {});
    } catch (err) {
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  applyProfile(u) {
    const nickname = u.nickname || '';
    const avatar = u.avatar || '';
    const defaultName = u.defaultName || '用户';

    let initial = '#';
    if (nickname) initial = nickname.slice(0, 1);
    else if (defaultName) initial = defaultName.replace(/[^0-9]/g, '') || '#';

    this.setData({
      nickname,
      avatar,
      avatarFull: avatar ? BASE_URL + avatar : '',
      defaultName,
      initial,
    });
  },

  onAvatarError() {
    this.setData({ avatar: '', avatarFull: '' });
  },

  /* ---------------------------------------------------------- 头像 */

  chooseAvatar() {
    if (this.data.uploading) return;

    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        const file = res.tempFiles && res.tempFiles[0];
        if (!file) return;

        /*
         * 选完图后先裁剪成正方形。
         *
         * 用 wx.cropImage（基础库 2.26.0+），cropScale 设为 1:1
         * 就是方形裁剪框，用户可拖动/缩放，确认后才上传。
         *
         * 为什么不直接上传让后端裁：
         *   后端只能硬裁中心区域，用户想保留的部分可能被切掉。
         *   让用户在裁剪界面自己选，体验好得多。
         *
         * 兼容性：低版本基础库没有 cropImage，降级为直接上传
         * （后端仍会裁成 200×200 正方形）。
         */
        if (typeof wx.cropImage === 'function') {
          wx.cropImage({
            src: file.tempFilePath,
            cropScale: '1:1',
            success: (cropRes) => {
              this.uploadAvatar(cropRes.tempFilePath);
            },
            fail: (err) => {
              /*
               * 用户点了取消（errMsg 含 cancel）就什么都不做；
               * 其他错误（如基础库不支持）降级为原图上传。
               */
              const msg = String((err && err.errMsg) || '');
              if (msg.indexOf('cancel') !== -1) return;
              this.uploadAvatar(file.tempFilePath);
            },
          });
        } else {
          this.uploadAvatar(file.tempFilePath);
        }
      },
      fail: () => {
        /* 用户取消，不提示 */
      },
    });
  },

  /**
   * 上传头像
   *
   * 用 wx.uploadFile 而不是 wx.request：
   *   后者发不了 multipart。
   *
   * 注意 uploadFile 不会自动带 Authorization，
   * 要从 storage 里读 token 自己加到 header。
   */
  uploadAvatar(filePath) {
    this.setData({ uploading: true });

    let token = '';
    try {
      token = wx.getStorageSync(TOKEN_KEY) || '';
    } catch (_) {}

    wx.uploadFile({
      url: BASE_URL + '/api/mp/avatar',
      filePath,
      name: 'file',
      header: token ? { Authorization: 'Bearer ' + token } : {},
      success: (res) => {
        let data = null;
        try {
          data = JSON.parse(res.data);
        } catch (_) {}

        if (res.statusCode === 200 && data && data.ok && data.avatar) {
          this.setData({
            avatar: data.avatar,
            avatarFull: BASE_URL + data.avatar,
            uploading: false,
          });
          wx.showToast({ title: '头像已更新', icon: 'none' });
        } else {
          this.setData({ uploading: false });
          wx.showToast({
            title: (data && data.error) || '上传失败',
            icon: 'none',
          });
        }
      },
      fail: (err) => {
        this.setData({ uploading: false });
        wx.showToast({ title: '上传失败，请重试', icon: 'none' });
      },
    });
  },

  /* ---------------------------------------------------------- 昵称 */

  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value });
  },

  /**
   * 失焦时裁剪长度。
   *
   * 微信的 type="nickname" 会一次性填入整段微信昵称，
   * 可能超过 20 字（含 emoji），这里截断。
   */
  onNicknameBlur(e) {
    const v = String(e.detail.value || '').slice(0, 20);
    this.setData({ nickname: v });
  },

  /* ---------------------------------------------------------- 保存 */

  async onSave() {
    if (this.data.saving) return;

    this.setData({ saving: true });

    try {
      const data = await put('/api/mp/profile', {
        nickname: this.data.nickname.trim(),
        avatar: this.data.avatar,
      });

      this.applyProfile((data && data.user) || {});
      wx.showToast({ title: '已保存', icon: 'none' });

      /* 稍微等一下让 toast 显示，然后返回 */
      setTimeout(() => this.goBack(), 600);
    } catch (err) {
      this.setData({ saving: false });
      wx.showToast({ title: err.message || '保存失败', icon: 'none' });
    }
  },

  goBack() {
    wx.navigateBack();
  },
});

# 陈彬拾光集 · 微信小程序

配套 [PRD-MP.md](PRD-MP.md)（需求文档）实现的小程序端。

---

## 目录结构

```
chenbin-light-mp/
├── miniprogram/                  小程序源码（导入开发者工具时选这个目录）
│   ├── app.js                    入口：静默登录 + 拉配置
│   ├── app.json                  页面注册 + 自定义 tabBar 声明
│   ├── app.wxss                  全局样式（暗调 + 金色）
│   ├── config/
│   │   └── index.js              ★ 环境配置（本地/生产域名切换）
│   ├── utils/
│   │   ├── request.js            网络请求（自动带 token + 401 重试）
│   │   ├── auth.js               静默登录
│   │   ├── image.js              图片 URL 拼接 + 相册 token
│   │   └── mosaic.js             首页马赛克版式计算
│   ├── custom-tab-bar/           自定义 tabBar（4 个，支持动态开关）
│   └── pages/
│       ├── index/                首页（开场动画 + 马赛克墙）
│       ├── collections/          摄影集（相册网格 + 筛选）
│       ├── album/                相册浏览（核心交互）
│       ├── mine/                 我的（收藏/点赞入口）
│       ├── about/                关于（控制台可配）
│       ├── favorites/            我的收藏
│       ├── likes/                我的点赞
│       └── unlock/               相册密码
├── tools/
│   ├── test-mp-api.js            后端接口测试（38 项）
│   └── test-avatar-upload.js     关于页头像上传测试
└── project.config.json           开发者工具项目配置
```

---

## 快速开始

### 第一步：启动后端

小程序依赖 Web 端的后端服务，先把它跑起来：

```powershell
cd D:\workspace\chenbin-light

# 关键：必须设置 MP_MOCK_OPENID，模拟微信登录
# 否则会去请求微信服务器，而你本地没有 AppID/Secret
$env:PORT='3000'
$env:HOST='0.0.0.0'          # 监听所有网卡，手机才能访问
$env:ADMIN_PASSWORD='test123456'
$env:MP_MOCK_OPENID='devuser'  # 开发模式：模拟登录

node server.js
```

**`MP_MOCK_OPENID` 是开发专用的**：
- 设置后，登录不请求微信服务器，直接生成一个模拟 openid
- 不同 code 得到不同 openid（模拟多个用户）
- 生产环境**不要设置**，改配 `MP_APPID` / `MP_SECRET`

### 第二步：确认局域网 IP

```powershell
ipconfig | Select-String "IPv4"
```

找到类似 `192.168.0.126` 的地址。

### 第三步：改配置里的域名

打开 `miniprogram/config/index.js`：

```js
const CONFIG = {
  local: {
    baseUrl: 'http://192.168.0.126:3000',  // ← 改成你的实际 IP
    debug: true,
  },
  prod: {
    baseUrl: 'https://photo.你的域名.com',   // ← 备案下来后改这里
    debug: false,
  },
};
```

### 第四步：导入开发者工具

1. 打开**微信开发者工具**
2. 选「导入项目」
3. 目录选 `D:\workspace\chenbin-light-mp\miniprogram`
4. AppID 填你的小程序 AppID（或先选「测试号」）
5. **重要**：右上角「详情」→「本地设置」→ 勾上
   - ☑ **不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书**

> 这一步必须做，因为本地是 `http://IP`，不是 HTTPS。

### 第五步：编译预览

点「编译」，应该能看到首页。

---

## 环境切换（开发 → 生产）

改 `miniprogram/config/index.js` 顶部一行：

```js
const ENV = 'local';   // 开发
const ENV = 'prod';    // 生产（提交审核前改成这个）
```

**提交审核前检查清单**：

- [ ] `ENV` 改成 `'prod'`
- [ ] `prod.baseUrl` 填的是备案通过的 HTTPS 域名
- [ ] 后端环境变量配了 `MP_APPID` 和 `MP_SECRET`
- [ ] 后端**没有**配 `MP_MOCK_OPENID`
- [ ] 小程序后台「开发管理」→「服务器域名」里配了 `request` 和 `downloadFile` 合法域名

---

## 后端配置说明

| 环境变量 | 必填 | 说明 |
|---|---|---|
| `MP_APPID` | 生产必填 | 小程序 AppID |
| `MP_SECRET` | 生产必填 | 小程序 AppSecret（**绝不能写进小程序代码**） |
| `MP_MOCK_OPENID` | 仅开发 | 设置后走模拟登录，不请求微信 |

**为什么 AppSecret 只能放后端**：
小程序代码会被反编译，任何写在小程序里的密钥都等于公开。
用 code 换 openid 必须在服务器上做。

---

## 已实现的功能

### 首页

- 三段式开场动画：欢迎语 → 图片飞入拼接 → 引导字
- **6 套马赛克版式**，按轮播图数量自适应
- 没有轮播图时用 CSS 绘制的默认图（书法字「拾光」+ 金色微光）
- 5 秒防抖：从其他 tab 切回来不重播
- 「跳过」入口

### 摄影集

- 相册网格（2 列，封面 3:4）
- 摄影集筛选 chip：全部 / 风光 / 儿童 / 人像
- 相册错开出现动画（每张延迟 40ms，总时长 < 600ms）
- 加锁相册显示锁标记，点击先去解锁页

### 相册浏览（核心）

- 全屏左右滑浏览
- **上滑展开 EXIF 面板**（跟手动画）
- 展开状态下左右滑，**面板保持展开**
- 单击照片 → 打开原生预览（可缩放、保存）
- 长按 → 保存到相册 / 分享
- 底部信息条：相册名 + 计数 + 点赞 + 收藏

### 我的 / 关于

- 我的收藏、我的点赞（后端同步，跨设备）
- 关于页：内容由 Web 控制台配置，可整体关闭
- 关闭后 tabBar 从 4 个变 3 个

### 相册密码

- 输密码解锁，7 天有效
- 连续错 5 次锁定 4 小时
- Token 存在 storage，不走 Cookie

---

## 联调测试

后端接口测试（38 项）：

```powershell
cd D:\workspace\chenbin-light-mp
node tools/test-mp-api.js http://localhost:3000
```

覆盖：登录、配置、照片列表、收藏、点赞、关于页配置、边界情况。

---

## 常见问题

### 编译后首页空白

**原因**：拉 `/api/mp/config` 失败。

**排查**：

1. 后端起了吗？浏览器访问 `http://你的IP:3000/api/collections` 试试
2. `config/index.js` 里的 `baseUrl` 对吗？不能用 `localhost`（手机访问不到）
3. 开发者工具勾了「不校验合法域名」吗？

### 点收藏/点赞没反应

**原因**：登录失败。

**排查**：

1. 后端有没有设 `MP_MOCK_OPENID`？
2. 看开发者工具的 Console，应该有 `[app] 登录失败` 的日志

### 真机上完全连不上

**原因**：真机不走「不校验合法域名」这个开关。

**只有两条路**：
1. 用**真机调试**模式（扫码后手机上仍然校验域名，也不行）
2. **必须**有 HTTPS + 备案域名

**所以真机测试必须等备案下来。**

### 相册打不开，提示需要密码

**原因**：这个相册在 Web 后台加了锁。

**测试方法**：在 Web 控制台给它加个密码，然后在解锁页输入。

### 关于页 tab 不见了

**原因**：Web 控制台里关于页是关闭状态。

**开启方法**：

目前需要在后端直接操作数据库，Web 控制台的管理界面还没做（见下方「待完成」）。

```sql
-- 临时手动开启
UPDATE mp_about SET enabled = 1 WHERE id = 1;
```

---

## 待完成

以下功能后端已支持，但 Web 控制台的界面还没做：

| 功能 | 后端接口 | 控制台界面 |
|---|---|---|
| 关于页配置（开关/名字/正文/联系方式） | ✅ 已实现 | ❌ 待做 |
| 关于页头像上传 | ✅ 已实现 | ❌ 待做 |

**临时方案**：用 API 直接配置。

```powershell
# 先登录拿 Cookie
$login = Invoke-WebRequest 'http://localhost:3000/api/auth/login' `
  -Method POST -ContentType 'application/json' `
  -Body '{"user":"admin","password":"test123456"}'
$cookie = $login.Headers['Set-Cookie'].Split(';')[0]

# 配置关于页
Invoke-WebRequest 'http://localhost:3000/api/admin/about' `
  -Method PUT -Headers @{ Cookie = $cookie } `
  -ContentType 'application/json' `
  -Body '{"enabled":true,"name":"陈彬","tagline":"摄影师 · 记录者","bio":"独立摄影师，因为女儿出生开始拿起相机。","contacts":[{"label":"微信","value":"chenbin_photo"}]}'
```

---

## 与 Web 端的关系

| 项 | 说明 |
|---|---|
| 后端 | **同一个** `server.js`，同一个数据库 |
| 照片 | 同一份文件，同一套四档缓存 |
| 相册结构 | 完全一致 |
| 用户体系 | **独立**：Web 用账号密码，小程序用 openid |
| 代码 | 独立目录，不混在一起 |

**新增的数据表**（都在同一个 `data.db`）：

- `mp_users` — 小程序用户（只有 openid）
- `mp_sessions` — 登录会话
- `mp_favorites` — 收藏
- `mp_likes` — 点赞
- `mp_about` — 关于页配置

**没有修改任何现有表结构**，所以 Web 端完全不受影响。

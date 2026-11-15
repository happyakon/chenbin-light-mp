/**
 * 诊断「控制台设置了但小程序不生效」
 *
 * 按顺序检查每一环：
 *   1. 后端是否在跑
 *   2. 数据库里有没有配置
 *   3. 接口返回什么
 *   4. 背景图能否访问
 *   5. 小程序连的地址对不对
 */
const fs = require('fs');
const path = require('path');

const LAN_IP = '192.168.0.126';
const PORT = 8080;

const MP_CONFIG = 'D:/workspace/chenbin-light-mp/miniprogram/config/index.js';

async function main() {
  console.log('\n=== 控制台配置不生效 · 逐环诊断 ===\n');

  /* ---------- 1. 小程序连的地址 ---------- */
  console.log('[1] 小程序连的后端地址');
  if (fs.existsSync(MP_CONFIG)) {
    const c = fs.readFileSync(MP_CONFIG, 'utf8');
    const m = /local:\s*\{[\s\S]*?baseUrl:\s*['"]([^'"]+)['"]/.exec(c);
    const envM = /const ENV = ['"](\w+)['"]/.exec(c);
    console.log('    当前环境:', envM ? envM[1] : '未知');
    console.log('    baseUrl:', m ? m[1] : '未找到');
    if (m && !m[1].includes(LAN_IP)) {
      console.log('    ⚠ 地址和本机 IP 不一致，小程序可能连不上');
    }
  } else {
    console.log('    ❌ 找不到配置文件');
  }

  /* ---------- 2. 后端是否在跑 ---------- */
  console.log('\n[2] 后端服务');
  let baseUrl = '';
  for (const host of [`http://${LAN_IP}:${PORT}`, `http://localhost:${PORT}`]) {
    try {
      const r = await fetch(host + '/api/mp/config', {
        signal: AbortSignal.timeout(4000),
      });
      if (r.ok) {
        baseUrl = host;
        console.log(`    ✓ ${host} 可访问`);
        break;
      }
    } catch (_) {
      console.log(`    ✗ ${host} 不可访问`);
    }
  }
  if (!baseUrl) {
    console.log('\n    ❌ 后端完全连不上，请检查 node server.js 是否在跑');
    return;
  }

  /* ---------- 3. 接口返回 ---------- */
  console.log('\n[3] 接口返回的 home 配置');
  const cfg = await (await fetch(baseUrl + '/api/mp/config')).json();
  if (!cfg.home) {
    console.log('    ❌ 响应里没有 home 字段！后端代码没重启？');
    console.log('    完整响应:', JSON.stringify(cfg).slice(0, 200));
    return;
  }
  console.log('    bgImage:  ', cfg.home.bgImage || '（空）');
  console.log('    title:    ', cfg.home.title || '（空）');
  console.log('    subtitle: ', cfg.home.subtitle ? cfg.home.subtitle.slice(0, 30) + '…' : '（空）');
  console.log('    cardTitle:', cfg.home.cardTitle || '（空）');

  if (!cfg.home.bgImage) {
    console.log('\n    ⚠ 背景图是空的，小程序会用默认山景');
    console.log('      去控制台「首页设置」上传一张');
  }

  /* ---------- 4. 背景图文件 ---------- */
  if (cfg.home.bgImage) {
    console.log('\n[4] 背景图文件');
    const imgUrl = baseUrl + cfg.home.bgImage;
    try {
      const r = await fetch(imgUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
      console.log('    URL:', cfg.home.bgImage);
      console.log('    状态:', r.status);
      console.log('    类型:', r.headers.get('content-type'));
      const len = Number(r.headers.get('content-length') || 0);
      console.log('    大小:', Math.round(len / 1024) + ' KB');
      if (r.status !== 200) {
        console.log('    ❌ 图片无法访问！');
      }
    } catch (e) {
      console.log('    ❌ 请求失败:', e.message);
    }

    // 磁盘上的文件
    const diskPath = 'D:/workspace/chenbin-light/photos' + cfg.home.bgImage;
    if (fs.existsSync(diskPath)) {
      const st = fs.statSync(diskPath);
      console.log('    磁盘文件: ✓', Math.round(st.size / 1024) + ' KB');
    } else {
      console.log('    磁盘文件: ❌ 不存在', diskPath);
    }
  }

  /* ---------- 5. 结论 ---------- */
  console.log('\n=== 结论 ===');
  console.log('如果上面全部正常，说明后端没问题，问题在小程序端。');
  console.log('请检查开发者工具：');
  console.log('  1. Console 有没有红色报错');
  console.log('  2. 点「编译」重新编译（不是刷新）');
  console.log('  3. 如果改了 app.json，必须「清缓存 → 全部清除」再编译');
  console.log('');
}

main().catch((e) => {
  console.error('诊断异常:', e);
  process.exit(1);
});

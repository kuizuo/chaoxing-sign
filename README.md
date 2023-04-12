# 🌟某星签到

<a href="https://www.npmjs.com/package/nuxt/v/rc"><img alt="size" src="https://img.shields.io/github/package-json/dependency-version/kuizuo/chaoxing-sign/dev/nuxt?style=flat&colorA=002438&colorB=28CF8D"></a> <a href="https://github.com/kuizuo/chaoxing-sign/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/workflow/status/kuizuo/chaoxing-sign/ci?label=ci&logo=github"></a>  <a href="https://github.com/kuizuo/chaoxing-sign/tree/HEAD/LICENSE"><img alt="License" src="https://img.shields.io/github/license/kuizuo/chaoxing-sign?style=flat&colorA=002438&colorB=28CF8D" /></a>

在这里你可以在摆脱客户端繁琐的签到流程，让签到不再是你的烦恼。

## ✨功能

网页版在线签到

- [x] 普通签到
- [x] 拍照签到
- [x] 手势签到
- [x] 位置签到
- [x] 签到码签到
- [x] 二维码签到（enc 已不在固定, 如果是刷新二维码, 签到必须在10秒完成）
- [x] 多用户凭据储存

## 🛠 运行

```shell
git clone https://github.com/kuizuo/chaoxing-sign.git
cd chaoxing-sign
pnpm install
```

你需要一个 PostgreSQL 数据库地址（用于存储账号信息以及自动监控签到），然后将项目根目录下 `.env.example` 文件更改成 `.env` 并替换 `DATABASE_URL` 为数据库地址(通常是远程地址)。运行如下命令用于同步数据库：

```shell
npx prisma db push
npx prisma generate
```

```shell
npm run dev
```

打包

```shell
npm run build
npm run start
```

## 部署

> 本项目不易部署，纯小白请跳过。

### PM2 + Nginx

本项目已经编写好了 `ecosystem.config.js` 文件，具体请根据实际情况修改环境变量，你可以直接使用 PM2 来启动项目。

```shell
npm run start:pm2
```

此时已经启动好了本地端口为 `8050` 的服务，要注意，如果你使用了 Nginx 的反向代理，那么你需要将 `AUTH_ORIGIN` 环境变量设置为你的域名，否则将无法正常使用。并在 Nginx 中添加如下配置：

```nginx
    location / {
      proxy_pass http://127.0.0.1:8050;
    }
```

此外可能还需要配置 SSL 证书，因为要调用摄像头权限就必须是在安全环境下（即https下），否则你将无法使用扫一扫功能，这也是无奈之举。

### Vercel or Netlify（不推荐）

由于采用 Nuxt.js 框架，所以非常容易部署在 Vercel 或 Netlify 等平台上，但还是不推荐部署，理由如下：

Vercel 或 Netlify 的服务器设立在国外，用户需要通过一些特殊手段能够访问，并且由于某星的服务器设立在国内，即便使用 [Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions) 也需要多一道障碍来访问，这将导致请求响应速度过慢，网站体验效果极其不佳，已亲测，因此不推荐使用（无奈之举）。

### 跨平台应用

TODO...

## 🤝 免责声明

本项目仅作为个人技术专研，仅供学习参考。不得用于商业用途。

## 📝 License

MIT License © 2023-PRESENT Kuizuo
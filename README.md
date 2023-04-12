# 🌟 Chaoxing-sign

<a href="https://www.npmjs.com/package/nuxt/v/rc"><img alt="size" src="https://img.shields.io/github/package-json/dependency-version/kuizuo/chaoxing-sign/dev/nuxt?style=flat&colorA=002438&colorB=28CF8D"></a> <a href="https://github.com/kuizuo/chaoxing-sign/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/workflow/status/kuizuo/chaoxing-sign/ci?label=ci&logo=github"></a>  <a href="https://github.com/kuizuo/chaoxing-sign/tree/HEAD/LICENSE"><img alt="License" src="https://img.shields.io/github/license/kuizuo/chaoxing-sign?style=flat&colorA=002438&colorB=28CF8D" /></a>

某星签到助手是一款方便快捷的工具，可以帮助用户记录签到信息。

## ✨功能

网页版在线签到

- [x] 普通签到
- [x] 拍照签到
- [x] 手势签到
- [x] 位置签到
- [x] 签到码签到
- [x] 二维码签到（enc 已不在固定, 即签到必须在10秒变换.）
- [x] 多用户凭据储存

## 🛠 运行

```shell
git clone https://github.com/kuizuo/chaoxing-sign.git
cd chaoxing-sign
pnpm install
```

你需要一个 PostgreSQL 数据库地址（用于存储账号信息以及自动监控签到），然后将项目根目录下 `.env.example` 文件更改成 `.env` 并填入相关信息。执行

```shell
pnpm run dev
```







## 部署

> 本项目极不易部署，纯小白请跳过。

PM2



### Vercel or Netlify（不推荐）

如果你尝试将本项目部署在 Vercel 或 Netlify上，且能通过一些特殊手段能够访问，但由于某星的服务器设立在国内，即便使用 [Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions) 也需要多一道障碍，导致请求响应速度过慢，网站体验效果极其不佳，因此不推荐使用（无奈之举）。

### 跨平台应用

TODO...

## 🤝 免责声明

本项目仅作为个人技术专研，仅供学习参考。不得用于商业用途。

## 📝 License

MIT License © 2023-PRESENT Kuizuo
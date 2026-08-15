# OurBook · 我们眼中的大学

一个由南开人发起、延续至今的公益项目：在校生与毕业生写下自己真实的大学体验，帮助高考生在志愿填报时看到更立体的大学。

站点基于 **VuePress 2**（Node.js 24 + Vite）构建，由 GitHub Actions 发布到 GitHub Pages，自定义域名 [www.wenkers.cn](https://www.wenkers.cn)。目前收录 66 所高校、400 余篇文章。

[![Deploy](https://github.com/weNKers/OurBook/actions/workflows/deploy.yml/badge.svg)](https://github.com/weNKers/OurBook/actions)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-lightgrey)](#版权)

## 目录

- [快速开始](#快速开始)
- [常用命令](#常用命令)
- [静态部署](#静态部署)
- [站点结构](#站点结构)
- [内容维护](#内容维护)
- [投稿](#投稿)
- [更新日志](#更新日志)
- [版权](#版权)

## 快速开始

需要 [Node.js](https://nodejs.org/) 24 或更高版本（仓库已自带 `.nvmrc`，推荐用 `nvm use` 切换）。

```bash
nvm use        # 切换到项目指定的 Node 版本
npm ci         # 安装依赖
npm run dev    # 启动开发服务器
```

默认访问 `http://localhost:8080/`（端口被占用时自动递增）。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 本地开发服务器 |
| `npm run build` | 构建静态站点到 `dist/` |
| `npm run audit` | 审计本地资源、图片、内链与内容 |
| `npm run check` | 完整检查（`audit` + `build`，与 CI 一致） |

提交前建议运行 `npm run check`。

## 静态部署

推送到 `master` 分支后，GitHub Actions 会自动执行「安装依赖 → 内容审计 → 构建 → 发布 GitHub Pages」，流程定义在 `.github/workflows/deploy.yml`。

- **自定义域名** `www.wenkers.cn` 配置在 `docs/.vuepress/public/CNAME`。
- **首次启用**：在仓库 Settings → Pages → Build and deployment 中选择 **GitHub Actions**。
- `deploy.sh` 是历史遗留的 SSH 强推 `gh-pages` 方式，**日常开发请勿使用**。

## 站点结构

内容统一放在 `docs/` 目录下：

| 路径 | 说明 |
| --- | --- |
| `docs/guide/` | 使用指南、投稿规范、序言、更新日志 |
| `docs/university/` | 按地区浏览高校的索引页（`beijing.md`、`shanghai.md` 等） |
| `docs/<学校缩写>/` | 每个高校一个目录，如 `docs/pku/`、`docs/thu/` |
| `docs/us/` | 关于我们 |
| `docs/feedback/` | 反馈 |

导航与侧边栏由配置和脚本自动生成，无需手工维护目录清单。

## 内容维护

### 文章结构

每篇文章是一个独立的 Markdown 文件，推荐在 frontmatter 中声明元信息，便于站内搜索与 SEO：

```yaml
---
title: 北京大学
description: 北京大学的学校概况、专业和校园体验。
author: 作者名
keywords:
  - 北京大学
  - 学校介绍
contentType: university
updated: 2026-08-03
---
```

字段说明、资源管理约定及旧文章迁移策略见[内容管理约定](/guide/content-schema.html)。

所有内部路径遵循 VuePress 规则，以 `/` 开头和结尾（如 `/pku/`）。

### 新增学校

1. 在 `docs/` 下创建以学校英文缩写命名的目录，并放置 `README.md` 作为根页面，例如 `docs/pku/`；
2. 在 `constants/univ.js` 中登记该缩写对应的中文全称；
3. 侧边栏会由脚本自动扫描生成，无需手动修改 `docs/.vuepress/sidebar.js`。

地区索引页位于 `docs/university/`，归属分组维护在 `docs/.vuepress/area.js`。

也可以先用生成器创建默认骨架：

```bash
node script/genFile.js
```

### 历史文章备份

失去时效性的旧文章会从站点正文移除，历史版本保留在仓库中作参考（根目录 `_backup/` 存放整站层面的历史备份）。

## 投稿

页面底部默认开启「帮助我们改善此页面」的编辑链接，可直接跳转到 GitHub 提交修改。

传统的文字稿投稿方式、三种稿件（综述 / 专业 / 感想）的格式规范，见[如何投稿](/guide/contribute.html)。

## 更新日志

见[更新日志](/guide/version.html)。

## 版权

站点内容遵循 **CC BY-NC-SA 4.0**，欢迎转载、参考，请注明出处。版权所有 © 2012-present weNKers。

---
title: "内容迁移批次"
description: "内容迁移批次相关内容。"
contentType: guide
keywords:
  - "内容迁移批次"
---

# 内容迁移批次

Frontmatter 与目录调整分批进行。学校内容现按地区、城市/省份和学校分层；旧学校 URL 不提供重定向，所有站内链接会使用新路径。

| 批次 | 范围 | 状态 |
| --- | --- | --- |
| 1 | 地区索引迁至 `docs/universities/<地区>/<城市>/index.md` | 已完成 |
| 2 | 学校内容迁至 `docs/universities/<地区>/<城市>/<学校>/` | 已完成 |
| 3 | `docs/guide/*.md` 指南页 | 待处理 |
| 4 | `docs/us/*.md` 关于我们、历史资料 | 待处理 |
| 5 | 各学校目录下的 `index.md`（原 `README.md`） | 待处理 |
| 6 | 各学校目录下的专业和个人体验文章 | 待处理 |

新增内容时使用 `docs/.vitepress/university-directory.json` 登记学校信息；站点侧栏和目录从注册表生成。Frontmatter 检查仍可用以下命令预览或处理对应批次：

```bash
# 先预览
node scripts/migrate-frontmatter.mjs university-regions

# 确认后写入
node scripts/migrate-frontmatter.mjs university-regions --apply
```

完成一批后运行 `npm run check`，确认内容、资源和内部链接审计通过，且 VitePress 构建、搜索、SEO、sitemap 与页面路由没有回归，再进入下一批。

## 图片资源批次

图片也按风险分批处理：

1. 已完成：本地资源存在性审计；11 个已确认可用的 Wikimedia 链接已切换到稳定入口。
2. 下一批：逐个确认剩余 Wikimedia 404 图片对应的现行校徽文件，再替换或删除图片引用。
3. 最后处理：Kuaizhan 图片迁移到本地或可靠图床；迁移前保留来源和许可信息，不直接复制不明来源图片。

检查命令：`npm run audit:images`；联网检查命令：`npm run audit:images:remote`。

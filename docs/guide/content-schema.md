---
title: "内容管理约定"
description: "内容管理约定相关内容。"
contentType: guide
keywords:
  - "内容管理约定"
---

# 内容管理约定

新文章建议使用 frontmatter，便于搜索、SEO 和后续批量维护：

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

其中 `title`、`description`、`author`、`keywords` 会进入站内搜索的补充索引；`contentType` 用于后续按学校、专业、经验和历史资料分类统计。旧文章可以继续使用现有格式，迁移时不要改变文件路径，以免影响已有链接。

资源优先使用文章附近的相对路径；站点公共图标、站点封面等才放在 `docs/public/`。历史设计稿和未发布的 A/B 资源放在仓库根目录的 `assets/source/`，不会被发布。

提交前运行：

```bash
npm run check
```

该命令会执行内容、资源和内部链接审计，构建 VitePress 站点，并验证页面路由、SEO 元数据、搜索索引、邮件反馈和 sitemap。资源审计会检查本地图片、媒体和下载文件是否存在；文本审计会检查 frontmatter 与一级标题。

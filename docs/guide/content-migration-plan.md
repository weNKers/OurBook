# 内容迁移批次

为了不改变旧文章路径和历史内容，frontmatter 采用分批迁移：

| 批次 | 范围 | 状态 |
| --- | --- | --- |
| 1 | `docs/university/*.md` 地区索引页 | 已完成 |
| 2 | `docs/guide/*.md` 指南页 | 待处理 |
| 3 | `docs/us/*.md` 关于我们、历史资料 | 待处理 |
| 4 | 各学校目录下的 `README.md` | 待处理 |
| 5 | 各学校目录下的专业和个人体验文章 | 待处理 |

每批迁移只添加 `title`、`description`、`contentType`、`keywords`，不移动文件、不改路由、不重写正文。执行方式：

```bash
# 先预览
node scripts/migrate-frontmatter.mjs university-regions

# 确认后写入
node scripts/migrate-frontmatter.mjs university-regions --apply
```

完成一批后运行 `npm run audit:content && npm run build`，确认搜索、SEO 和页面路由没有回归，再进入下一批。

## 图片资源批次

图片也按风险分批处理：

1. 已完成：本地资源存在性审计；11 个已确认可用的 Wikimedia 链接已切换到稳定入口。
2. 下一批：逐个确认剩余 Wikimedia 404 图片对应的现行校徽文件，再替换或删除图片引用。
3. 最后处理：Kuaizhan 图片迁移到本地或可靠图床；迁移前保留来源和许可信息，不直接复制不明来源图片。

检查命令：`npm run audit:images`；联网检查命令：`npm run audit:images:remote`。

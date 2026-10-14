# OurBook 迁移 VitePress 可行性调研

调研日期：2026-10-14

## 结论

**可以迁移，技术上可行；适合做一次受控的静态站点引擎替换。** OurBook 的主体是 Markdown 和静态资源，部署目标是 GitHub Pages，VitePress 支持相同的内容形态和部署方式。迁移不是改几个依赖就结束：配置、主题样式、搜索元数据、SEO/站点地图、评论挂载，以及目录首页路由都需要适配。

建议先基于 **VitePress 稳定版 1.6.4** 做迁移原型。当前 VitePress 官网主文档显示 `2.0.0-alpha.20`，并提供 1.6.4 独立文档入口；生产迁移若没有明确需要 v2 新功能，应避免把 alpha 作为默认生产目标。[安装与版本文档](https://vitepress.dev/guide/getting-started) [发布版本](https://github.com/vuejs/vitepress/releases)

## 当前架构概况

- 项目当前已是 **VuePress 2 + Vite bundler**。依赖版本为 VuePress `2.0.0-rc.30`、默认主题 `2.0.0-rc.132`，另有 SEO、sitemap、SlimSearch 插件。
- `docs/` 中有 416 个 Markdown 文件，其中 71 个 `README.md`；README 文档说明站点覆盖 66 所高校、400 余篇文章。
- GitHub Actions 执行内容与资源审计、构建、上传 GitHub Pages artifact 和部署；站点使用根域名 `www.wenkers.cn`，所以 `base: '/'` 可以原样保留。
- 当前 `dist/` 是构建产物，脚本与资源审计约定仍有若干 `.vuepress` 路径。
- 自定义功能包括 SlimSearch 的描述、关键词、内容类型和路径字段，SEO 与 sitemap 插件，Cusdis 评论的 Vue Router 页面切换挂载，以及主题 Sass/CSS 覆盖。

## 迁移工作量与风险

| 范围 | 评估 | 需要处理的事项 |
| --- | --- | --- |
| Markdown 正文 | 低到中 | frontmatter 的 `title`、`description`、`keywords` 等都是常规 YAML，可继续使用；当前正文以 Markdown 为主。仍需抽样检查 HTML 表格、iframe、图片和链接的渲染差异。VitePress 使用 Markdown-it，也支持原生 HTML 与 Vue 组件。[Markdown 扩展](https://vitepress.dev/guide/markdown) |
| 目录首页和 URL | 中、高风险 | VuePress 会把目录内 `README.md` 作为目录首页；VitePress 的文档示例以 `index.md` 作为目录首页。现有 71 个 README 首页需批量改成 `index.md`，或配置路由重写，并验证 `/学校缩写/` 等现有 URL 与链接不变。[VuePress 页面路由](https://vuepress.vuejs.org/guide/page) [VitePress 路由](https://vitepress.dev/guide/routing) |
| 导航与侧边栏 | 中 | 现有 `sidebar.js` 根据学校和地区数据拼装分组。结构与内容可以复用，配置对象需要转换成 VitePress `themeConfig.nav` / `sidebar` 格式；官方迁移说明也指出侧边栏不再从 frontmatter 自动生成。[迁移指南](https://vitepress.dev/guide/migration-from-vuepress) |
| 搜索 | 中、高风险 | VitePress 默认主题提供本地全文搜索 MiniSearch，并能处理中文分词；当前 SlimSearch 搜索字段包括 description、keywords、contentType、路径，且有自定义占位文案、延迟和快捷键设置。默认本地搜索不能保证完整复刻这些字段与交互，需要验证 MiniSearch 自定义索引/渲染扩展，或接入 Pagefind 等方案。[VitePress 搜索](https://vitepress.dev/reference/default-theme-search) |
| SEO 与 sitemap | 中 | `@vuepress/plugin-seo` 和 `@vuepress/plugin-sitemap` 不能直接在 VitePress 使用。VitePress 有 `transformHead` 等构建钩子可补元信息；官方 sitemap 页面目前列在 Experimental，需要核实其成熟度，或采用自定义 `buildEnd` 生成 sitemap。需对照现有 canonical、description、Open Graph 等产物。[站点配置与钩子](https://vitepress.dev/reference/site-config) [Sitemap](https://vitepress.dev/guide/sitemap-generation) |
| 评论与客户端行为 | 中 | Cusdis 可继续通过自定义主题/客户端代码挂载，但 `docs/.vuepress/client.js` 依赖 VuePress Router 和 `.vp-page` DOM 结构，需适配 VitePress 的路由生命周期和默认主题 DOM。此项应单独做页面切换、iframe 高度与错误回退验证。[扩展默认主题](https://vitepress.dev/guide/extending-default-theme) |
| 样式与静态资源 | 中 | Logo、图标、`CNAME` 等可复制到 `docs/public`；VitePress 将源目录下的 `public/` 原样复制到构建根目录。`docs/.vuepress/styles/index.scss` 的变量和选择器要对照 VitePress 默认主题重写，主题代码放到 `.vitepress/theme`。审计脚本中指向 `.vuepress/public` 的路径也要同步改为新目录。旧 `.vuepress/theme` 资源是否仍被引用需迁移时确认。[资源处理](https://vitepress.dev/guide/asset-handling) |
| GitHub Pages | 低 | 当前 Actions 的 Pages 发布模型与 VitePress 官方示例一致；改构建命令及 artifact 输出路径，并保留仓库的内容审计步骤即可。自定义域名和根路径 `base` 可继续沿用。[VitePress 部署](https://vitepress.dev/guide/deploy) |

## 建议实施顺序

1. 建立 VitePress 1.6.4 原型分支，暂不改动主站发布流程。
2. 新建 `.vitepress/config.mts`、默认主题配置和样式入口；先接入 `/`、指南、一个地区页、两所高校及一篇长文章。
3. 处理 README 首页路由，确保旧目录 URL 继续有效；用现有 `audit:links:strict` 规则检查站内链接，并检查生成文件映射。
4. 分别验证搜索字段/中文检索、SEO 标签和 sitemap、Cusdis 页面切换、资源路径、移动端样式。
5. 将现有审计脚本从 `.vuepress/public` 解耦为配置路径或迁移到 `.vitepress/public`，切换 CI 构建和 artifact 路径。
6. 只有在原型达到 URL、内容、功能和视觉验收要求后，才一次性切换 Pages workflow；保留回滚点。

## 判断

对 OurBook 来说，迁移**值得考虑**。当前 VuePress 已使用 Vite，因此收益主要来自切换到 VitePress 的站点架构和主题生态；成本集中在兼容差异和既有定制的重做。若核心诉求是稳定构建和减少维护，先将 VuePress RC 依赖整理到兼容的稳定版本，可能比迁移更省改动。若决定转向 VitePress，按上述原型先验证搜索、SEO、评论和 `README.md` 路由，预计内容本身无需大规模重写。

## 主要官方资料

- [VitePress 迁移自 VuePress](https://vitepress.dev/guide/migration-from-vuepress)
- [VitePress 路由](https://vitepress.dev/guide/routing)
- [VitePress 搜索](https://vitepress.dev/reference/default-theme-search)
- [VitePress 部署](https://vitepress.dev/guide/deploy)
- [VitePress 与 VuePress 项目定位](https://v2.vuepress.vuejs.org/guide/introduction)

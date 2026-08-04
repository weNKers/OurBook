# OurBook

created by vuepress

## how to run

```bash
nvm use
npm ci
npm run dev

visit localhost:8080
```

本项目当前使用 Node.js 24 LTS、VuePress 2 和 Vite。首次升级后，原 VuePress 1 自定义主题暂未启用，站点先使用 VuePress 2 默认主题；旧主题源码保留在 `docs/.vuepress/theme/`，后续可以单独迁移到 Vue 3。

当前主题已启用 VuePress 2 的本地搜索、正文关键词索引、图片放大、代码复制、返回顶部、阅读进度和标题高亮等能力。

## 静态部署

项目默认使用 GitHub Actions 构建并发布到 GitHub Pages：推送到 `master` 后，Actions 会在 Node.js 24 环境中执行 `npm ci`、内容/资源审计和 `npm run build`，再上传 `dist`。首次启用时，在仓库 Settings → Pages → Build and deployment 中选择 GitHub Actions；自定义域名 `www.wenkers.cn` 也在这里配置。

本地的 `deploy.sh` 仍可作为手动兜底，但它会通过 SSH 强制推送 `gh-pages`，不建议和 Actions 同时作为日常发布入口。

提交前可运行：

```bash
npm run audit
npm run build
```

## how to deploy

```bash
npm run build
npm run deploy-ghpages
```
如果电脑没有安装`zsh`，那么请自行修改脚本为`bash`或是别的`shell工具`

## how to write

这里主要讲一些页面配置的东西。  

首先关于`vuepress`的使用，大部分内容可以在其官网上进行查看https://vuepress.vuejs.org/zh/  

关于本页面的编写，需要同步进行配置几个地方。

**基于遵守vuepress的路径解析原理，该项目中所有文件路径都写成`/dir/`，头部和尾部都需要带上`/`符号**

### 地区配置  

需要在`/docs/university/`目录中增加城市的`markdown`文件，例如`beijing.md`，然后需要在`/docs/.vuepress/area.js/`增加城市信息，**现有的城市信息已经配置完善不需要再配置**。
```javascript
var area = [
  {
    title: '华北地区',
    collapsable: false,
    children: [
      'beijing'
    ]
  }
];
```

### 学校配置  

#### 结构的约定（可以跳过）
每一个学校以学校英文简称在`/docs/`下创建一个文件夹，例如`/docs/pku/`；如果存在重名则需要写成有区别的名字，我们约定重复的简称后面加`_{数字}`，例如`北京大学`为`/docs/pku/`，假设存在`北京没有英文名大学`简称也是`pku`，那么路径为`/docs/pku_2/`，并且一定要有一篇`README.md`作为根路由。  

同时学校的的目录结构也需要在`/docs/.vuepress/sidebar.js`中进行配置，例如：  
```javascript
var sidebar = {
  '/pku/': [{
    title: '北京大学',
    collapsable: false,
    children: [
      '',
      'article'
    ]
  }],
};
```
这样做的目的是为了将各个学校的每一篇文章都拆成一个`markdown`文件，以便进行更为`颗粒化`的管理，可以在本地运行后，点击`http://localhost:8080/OurBook/pku/`查看侧边栏配置的修改。

#### 生成器

首先在`/docs/.vuepress/univ.js`中配置所需要添加的大学的名字与简称；  

然后可以在`script`文件夹中找到`genFile.js`，使用以下命令可以自行生成默认文件结构。
```bash
node genFile.js
```

**现已经更改为脚本自动扫文件目录生成，无需再进行配置**

### 文章结构  

这里约定每一篇文章都是单独的`markdown`文件，每篇文章需要有一级标题，作者使用`>`符号包起来，其余具体的可以看看[`markdown`的语法](https://www.zybuluo.com/mdeditor)

新文章的 frontmatter 和资源管理约定见[内容管理约定](/guide/content-schema.html)。


### 备份计划  

关于过去的已经有的文章，但是太过久远已经失效的，在每所学校路径下都有一个备份文件夹，写做`/docs/pku/backup/`，里面存放该项目所涉及的所有的失去时效性的文章以作参考。

### 自定义页面  

由于本项目使用`vuepress`构建，所以每个md文件都会被编译为`.vue`文件，所以可以在markdown当中直接书写页面，具体的使用方式可以参照[vuepress自定义页面](https://vuepress.vuejs.org/zh/default-theme-config/#%E8%87%AA%E5%AE%9A%E4%B9%89%E9%A1%B5%E9%9D%A2%E7%B1%BB)来进行书写

### 自定义主题
在路径`/docs/.vuepress/theme`文件夹下放置了整个网站的主题，包括样式与功能，修改自`@default-theme`，修改范畴：
- search logic
- wechat img
- disqus/laibili
- share with copyright

### 排版指南
[中文markdown排版指南](https://sparanoid.com/note/chinese-copywriting-guidelines/)

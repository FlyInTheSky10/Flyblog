---
title: Flyblog 简单静态博客生成器项目分析
date: 2021-12-11 00:11
categories:
- cat
tags:
- Node.js
- 前端
- 后端
---

# 简介

  [Fly Blog](https://github.com/FlyInThesky10/Flyblog) ，一款基于 Node.js 的静态博客生成器。

  [Fly Blog](https://github.com/FlyInThesky10/Flyblog)  可以将你的 Markdown 文件快速生成一个静态博客！无需服务器，仅需要将生成的静态文件提交至 Github Pages 或其他 Pages 服务，即可建立你的博客！

  支持使用数学公式渲染 (KaTeX)，支持 Font Awesome 图标，支持代码块自动渲染。

  注意：[Fly Blog](https://github.com/FlyInThesky10/Flyblog) 仅处于起步阶段。若使用 [Fly Blog](https://github.com/FlyInThesky10/Flyblog) 修改了除 `assets / source` 文件夹的内容，则将难以适配未来的更新。请谨慎修改除 `assets / source` 文件夹的内容。为了安全起见，请保留好您的 `.md` 文件。

静态生成器采用 Node.js 实现，渲染 HTML 模板引擎采用 ejs，前端采用原生 HTML+CSS+JS

(本博客即采用 Flyblog 驱动)

<!-- more -->

# 使用

## 安装说明

将本仓库 clone 到本地后，在根目录运行

```
npm install
```

来安装所需要的依赖库。

然后可以进行连接，将 flyblog 连接到全局

```
npm link
```

操作成功后可以直接使用 `flyblog` 来代替 `npm run flyblog` 或者 `node ./src/index.js`

至此，安装完成

使用

```
flyblog generate
```

或者

```
flyblog g
```

来构建一个静态网页存储于 `./public/`

使用

```
flyblog server
```

或者

```
flyblog s
```

来将网站运行在本地服务器 / localhost 上

使用

```
flyblog clean
```

或者

```
flyblog c
```

来清理`./public/`文件夹

## 使用必知文件

### `./config.json` 配置文件

`title`：网页标题
`subtitle`：子标题
`author`：作者名
`description`：页面头像下方的文字
`rootpath`：网页的根位置 (末尾不要出现`/`)
`port`：本地服务器运行端口
`pages`：自定义页面的标题`title`以及在 `/src/source/page` 中的文件名`fileName` (不需要后缀)

### `./src/source/` 文件夹

`.md`源码文件储存文件夹。

`./src/source/post/`：存储博客文章的 `.md` 文件
`./src/source/page/`：存储自定义页面的 `.md` 文件
`./src/source/favicon.ico`：网站 `ico` 图标，**不可缺少**

### `./src/assets/` 文件夹

静态文件储存文件夹。

`./src/assets/css/`：储存输出到 `./public/static/css/` 中的 `css` 文件
`./src/assets/js/`：储存输出到 `./public/static/js/` 中的 `js` 文件
`./src/assets/images/`：储存图片文件，其中`./src/assets/images/avatar.jpg` 为头像，`./src/assets/images/header_background.png` 为头像背景图，后缀名文件名可在 `./src/layout/header.ejs` 中修改，目前暂不支持自定义文件路径。

### `./src/layout/` 文件夹

储存 `.ejs` 模板文件。可以自行修改来达到自定义的效果。**现阶段不建议修改此处。**

### `.md` 文章格式

文章头与 Hexo 保持一致
例子：
```
---
title: Vue3.0 仿 12306 前端项目分析
date: 2021-11-09 11:25
categories:
- 前端
tags:
- Vue
- 前端
---
这里是文章内容
```
## 简单指南

1. 安装

```
npm install
npm link
```

2. 配置 `/config.json` 文件
3. 将你的 `.md` 博客原文放入 `/src/source/post/`，注意上面提到的格式
4. 将`/config.json`中的`pages`的 `.md` 原文放入`/src/source/page/`
5. 将网站图标放到 `./src/source/favicon.ico`
6. 将背景图放到 `./src/assets/images/header_background.png`
7. 将头像放到 `./src/assets/images/avatar.jpg`
5. 命令行启动服务器测试

```
flyblog s
```

5. 命令行生成 `/public/` 文件夹

```
flyblog g
```
然后将 `/public/` 中的内容推到 Github Pages 等即可。
（注意有些 Pages 提供的是 CI 服务，请上传源码然后运行后将 Pages 目录指定为 `/public/`！）

若无法链接，则将命令中的 `flyblog` 替换为 `npm run flyblog` 或者 `node ./src/index.js`

# 项目分析

## 项目结构

```
./package.json: npm 包配置
./package-lock.json: npm 包配置
./.gitignore: git ignore 文件
./config.json: 用户配置文件，Flyblog 的顶级配置文件
./src/assets/: 存储静态的 CSS, JS, 图片文件
./src/source/: 存储用户 markdown 页面文件
./src/layout/: 存储 ejs 渲染模板
./src/utils/: 储存一些模块化封装工具
./src/handles/: 储存 Flyblog 核心处理程序
./src/index.js: 整个 Flyblog 入口程序
```

## `./config.json`

```json
{
    "title": "FlyInTheSky's Blog", // 网站标题
    "subtitle": "a simple blog", // 网站子标题
    "author": "FlyInTheSky", // 作者名
    "description": "「不忘初心，方得始终」", // 页面作者名下方的文字
    "rootpath": "https://flyblog.vercel.app", // 网站根目录的路径，末尾不带'/'
    "port": 3000, // 服务器运行时的端口
    "pages": [ // 自定义页面
        {
            "fileName": "about", // 自定义页面的文件名 (不带后缀), 以及在根目录下哪个文件夹。例如本例为 https://flyblog.vercel.app/about/
            "title": "关于" // 网站标题
        },
        {
            "fileName": "friends",
            "title": "友链"
        }
    ]
}
```

## `./src/index.js`

主要是处理用户的输入参数，然后分流到各个部分

## `./src/layout/*.ejs`

为渲染的 EJS 模板，本质上是 HTML 内嵌 JS 代码实现渲染

## `./src/utils/`

### `./src/utils/markedHelper.js`

主要负责一些关于 Markdown 源码转换的部分的函数功能。

```js
/**
* Get HTML from markdown by file name and type.
* @returns {string} HTML
*/
getHTMLFromMarked(fileName, type);
/**
* Get HTML introduction from markdown by file name and type.
* @returns {string} HTML introduction
*/
getIntroFromFileName(fileName);
```

### `./src/utils/infoHelper.js`

主要负责一些关于信息获取的部分的函数功能。

```js
/**
* Get information from the markdown file by file name.
* @returns {{date: Date, fileName: string, title: string, tags: String[]}} information
*/
getInfoFromMarked(fileName, type);
/**
* Get global config.
* @returns {Object} config
*/
getConfig();
/**
* Set server mode, set the hostname to local IP address or local host.
*/
setServerMode();
/**
* Get host name.
* @returns {string} host name
*/
getHostName();
```

### `./src/utils/ejsHelper.js`

主要负责一些关于 EJS 模板渲染的部分的函数功能。

```js
/**
* Get post page HTML from the information.
* @returns {String} post page HTML
*/
renderPostPage(config, post);
/**
* Get index page HTML from the information.
* @returns {String} index page HTML
*/
renderIndexPage(config, postList, pageCode, lastPage);
/**
* Get tags page HTML from the information.
* @returns {String} tags page HTML
*/
renderTagsPage(config, tagList);
/**
* Get tag list page HTML from the information.
* @returns {String} tags list page HTML
*/
renderTagListPage(config, tagName, postList, pageCode, lastPage);
/**
* Get other page HTML from the information.
* @returns {String} other page HTML
*/
renderOtherPage(config, title, content);
```

### `./src/utils/staticHelper.js`

主要负责一些关于静态文件输出的部分的函数功能。

```js
/**
* Get the public folder's path.
* @returns {string} public folder's path
*/
getPublicPath();
/**
* Export static assets by directory name.
*/
exportStaticAsset(dirName);
```

### `./src/utils/osHelper.js`

主要负责一些关于操作系统的部分的函数功能。
```js
/**
* Get local IP address.
* @returns {string} IP address
*/
getIPAddress();
/**
* Delete directory.
*/
deleteAllFileByDir(root);
```

## `./src/handles/`

### `./src/handles/postManager.js`

处理文章相关的各种数据，所有程序想要获取文章的各种信息都必须使用这个类。

```js
/**
* Initiative the post manager.
*/
initPostList();
/**
* Get post list by tag name and range[l, r].
* @returns {Object[]} post list
*/
getPostListByTagName(tagName, l, r);
/**
* Get tag list.
* @returns {String[]} tag list
*/
getTagList();
/**
* Get post list by range[l, r].
* @returns {Object[]} post list
*/
getPostList(l, r);
/**
* Get the number of posts.
* @returns {Number} the number of posts
*/
getPostCount();
/**
* Get the number of posts in tag.
* @returns {Number} the number of posts in tag
*/
getPostCountByTagName(tagName);
```

### `./src/handles/generator.js`

将得到的文章信息生成为文件的 generator。

```js
/**
* Initiative the generator.
*/
init();
/**
* Generate all post pages to public folder.
* @returns {Promise<void>}
*/
async generatePostPage();
/**
* Generate all index pages to public folder.
* @returns {Promise<void>}
*/
async generateIndexPage();
/**
* Generate all tags pages to public folder.
* @returns {Promise<void>}
*/
async generateTagsPage();
/**
* Generate all other pages to public folder.
* @returns {Promise<void>}
*/
async generateOtherPage();
/**
* Get the number of index pages
* @returns {number} the number of index pages
*/
getIndexPageCount();
/**
* Get the number of tag pages
* @returns {number} the number of tag pages
*/
getPageTagCount(tagName);
```

### `./src/handles/server.js`

运行本地服务器相关处理操作。

```js
/**
* Set server port to new one.
*/
setPort(newport);
/**
* Get server port.
* @returns {number}
*/
getPort();
/**
* Start the server.
*/
start();
```
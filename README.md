<h2 align="center">Fly Blog</h2>
<p align="center">
  <img alt="GitHub license" src="https://img.shields.io/github/license/FlyInThesky10/Flyblog">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/FlyInThesky10/Flyblog">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/FlyInThesky10/Flyblog?style=social">
</p>


### 简介

  [Fly Blog](https://github.com/FlyInThesky10/Flyblog) ，一款基于 Node.js 的静态博客生成器。

  [Fly Blog](https://github.com/FlyInThesky10/Flyblog)  可以将你的 Markdown 文件快速生成一个静态博客！无需服务器，仅需要将生成的静态文件提交至 Github Pages 或其他 Pages 服务，即可建立你的博客！

  支持使用`$$`包含的数学公式渲染 (Katex)，支持 Font Awesome 图标，支持代码块自动渲染。

  注意：[Fly Blog](https://github.com/FlyInThesky10/Flyblog) 仅处于起步阶段。若使用 [Fly Blog](https://github.com/FlyInThesky10/Flyblog) 修改了除 `assets / source` 文件夹的内容，则将难以适配未来的更新。请谨慎修改除 `assets / source` 文件夹的内容。为了安全起见，请保留好您的 `.md` 文件。

### 简单结构

#### `/config.json` 配置文件

`title`：网页标题
`subtitle`：子标题
`author`：作者名
`description`：页面头像下方的文字
`rootpath`：网页的根位置 (末尾不要出现`/`)
`port`：本地服务器运行端口
`pages`：自定义页面的标题`title`以及在 `/src/source/page` 中的文件名`fileName` (不需要后缀)

#### `/src/source/` 文件夹

`.md`源码文件储存文件夹。

`/src/source/post/`：存储博客文章的 `.md` 文件
`/src/source/page/`：存储自定义页面的 `.md` 文件
`/src/source/favicon.ico`：网站 `ico` 图标，不可缺少

#### `/src/assets/` 文件夹

静态文件储存文件夹。

`/src/assets/css`：储存 `css` 文件
`/src/assets/js`：储存 `js` 文件
`/src/assets/images`：储存图片文件，其中`/src/assets/images/avatar.jpg` 为头像，`/src/assets/images/header_background.png` 为头像背景图，后缀名文件名可在 `/src/layout/header.ejs` 中修改，目前暂不支持自定义文件名。

#### `/src/layout/` 文件夹

储存 `.ejs` 模板文件。

#### `.md` 文章格式

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
文章内容
```

### 安装
```
npm install
npm link
```

### 使用

#### 构建到 `/public`
```
flyblog generate
```
或者
```
flyblog g
```

#### 本地服务器运行
```
flyblog server
```
或者
```
flyblog s
```

#### 清理 `/public`
```
flyblog clean
```
或者
```
flyblog c
```

### 简单指南

1. 安装

```
npm install
npm link
```

2. 配置 `/config.json` 文件
3. 将你的 `.md` 博客原文放入 `/src/source/post/`，将`/config.json`中的`pages`的 `.md` 原文放入`/src/source/page/`

4. 命令行启动服务器测试

```
flyblog server
```

5. 命令行生成 `/public/` 文件夹

```
flyblog generate
```
然后将 `/public/` 中的内容推到 Github Pages 等即可。
（注意有些 Pages 提供的是 CI 服务，请上传源码然后运行后将 Pages 目录指定为 `/public/`！）
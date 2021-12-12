---
title: Docker 初探
date: 2021-12-12 09:25
categories:
- cat
tags:
- Docker
---

# 引入

Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的镜像中。容器是完全使用沙箱机制，相互之间不会有任何接口。

简而言之，Docker 可以不用用户自己来搭建环境，而是直接将程序运行在 Docker 容器中，免去了环境搭建的过程。

Docker 不同于虚拟机，Docker 较于虚拟机轻量很多。

Docker 可以使用容器实现应用程序相互隔离，而不需要使用虚拟机。
<!-- more -->

# 初探：将 Flyblog 装入 Docker

## Dockerfile

在 Flyblog 根目录创建 `Dockerfile` 文件，然后编写

```dockerfile
FROM node:latest
```
指定 node 镜像

```dockerfile
# Create app directory
WORKDIR /usr/src/app
```
Docker 容器的工作路径

```dockerfile
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
```
将 package.json, package-lock.json 拷贝

```dockerfile
ENV PARAMS=""
```
定义一个变量，用于容器传参数

```dockerfile
RUN npm install
```
初始化命令

```dockerfile
EXPOSE 3000
```
暴露端口

```dockerfile
CMD node ./src/index.js $PARAMS
```
运行

最终的 Dockerfile
```dockerfile
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
```

```dockerfile
# Bundle app source
COPY . .
```

```dockerfile
# Bundle app source
COPY . .
```

最终的 Dockerfile 文件
```dockerfile
FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

ENV PARAMS=""

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000

CMD node ./src/index.js $PARAMS
```

## .dockerignore

在 `Dockerfile` 的同一个文件夹中创建一个 `.dockerignore` 文件，带有以下内容：

```
node_modules
npm-debug.log
```

这将避免你的本地模块以及调试日志被拷贝进入到你的 Docker 镜像中，以至于把你镜像原有安装的模块给覆盖了。

## Docker

```
docker build . -t fly/flyblog
```

构建镜像

```
docker images
```

查看镜像

```
docker run -p 49160:3000 -e PARAMS="s" -d fly/flyblog
```

运行镜像

```
docker ps
```

得到当前容器进程

```
docker logs <container id>
```

得到指定 id 容器的输出

```
curl -i localhost:49160
```

测试
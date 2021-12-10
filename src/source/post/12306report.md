---
title: Vue3.0 仿 12306 前端项目分析
date: 2021-11-09 11:25
categories:
- cat
tags:
- Vue
- 前端
---
# 项目简介

一个部分仿 12306 前端的项目。

## 开发工具

- Vue3.0：主框架
- Vue-cli：构建 Vue 项目
- Vue-route：实现单页面应用 (路由功能)
- Vuex：实现全局的数据共享
- Better-Scroll：实现更好的滚动框
- mock.js：实现模拟后端数据发送

## 支持功能

- 查询页点击 `出发站` 和 `到达站` ，可支持按城市拼音首字母分类选择
- 查询页 `查询` 按钮，跳转查询到的列车选票页
- 选票页每个 `列车` 下用时后的 `小三角` 点击后展开详细经停信息
- 点击 `头部` 的 `发到站` 可交换车站
- 页面 `头部` 左侧 `箭头` 可返回上一页，且保存操作
- 购票页面下拉列表可刷新
<!-- more -->

# 项目结构

## 文件结构

```
\12306
	\src
		\assets: 资源文件 (图片)
		\components: 组件文件
		\mock: mock 相关
		\router: vue-router 配置
		\static: 一些公用 css
		\store: vuex 相关
		\utils: 第三方库
		App.vue: 总应用
		main.js: 程序入口
	vue.config.js: cli 相关
	babel.config.js: cli 相关
	package.json: cli 相关
	deploy.sh: push 到 github
```

## 组件结构

```
App.vue: 总组件
	alertbox.vue: 警告对话框组件
	confirmbox.vue: 确认对话框组件
	(route)search
	(route)buyticket
	(route)stations
	(route)blank
search.vue: 查询页组件 (整个列车数据在此组件 created() 中获取，此页面仅在切换到 stations.vue 组件后缓存)
buyticket.vue: 选票页组件 (此页面不缓存)
stations.vue：选站页组件 (此页面不缓存)
blank.vue: 空组件，用于解决 <keep-alive :include="keepAlivelist"> keepAliveList 为 "" 时失效的情况
```

路由地址对应组件名

# 代码分析

## 入口

创建 App 应用并且注册 `router`和 `store`（vuex）, 然后 mounted 应用

mock.js 的初始化

## 主应用 App.vue

用  `<route-view>` 加载 `route` ，并且使用  `<keep-alive :include="keepAliveList">` 来进行选择性的路由页面缓存 (后有详细解释)，使用具名 `<transition>` 实现路由切换动画

在路由配置中增加 `meta` 对象，设置 `meta.index`

再在 App.vue 中使用一个 watch 来 watch `$route` 的变化，然后用 `$meta.index` 的值来判断 `<transition>`是加左滑还是右滑的名字

```js
watch: {
	$route(to, from) {
		if (from.meta.index === undefined) this.transitionName = "";
		else if (to.meta.index > from.meta.index) {
			this.transitionName = "slide-left";
		} else this.transitionName = "slide-right";
	}
}
```

动画的 css 具体官方文档有详细解释

**需要注意的是**，每个有过渡动画的页面需要设置以下 css 样式让下一个去的页面一定在左上方

```css
position: absolute;
left: 0;
right: 0;
```

动画原理是 from 和 to 的 div 会同时存在于动画过程中，等动画结束了 from 就会销毁，所以 to 的 div 要设置这个 css 样式

---

引入两个组件 `alertbox.vue` 以及 `confirmbox.vue`，使用具名 `v-slot`为组件提供 `props` 
在使用中

```html
<alertbox ref="alertbox">
	<template v-slot:title="{ title }">{{ title }}</template>
	<template v-slot:content="{ content }">{{ content }}</template>
</alertbox>
```
在组件中
```html
<slot name="title" :title="title"></slot>
```

并且使用 ref 来方便 App.vue 组件获取子组件的对象 (`this.$refs.alertbox`)

---

App.vue 使用 `provide` 为子组件（路由）提供了数据 (子组件使用 `inject` 获取)

App.vue 里存在一些父组件中转的函数

---

App.vue 中提供 `reloadRoute()` 方法，原理是 `v-if` ，先不显示，再使用 `$this.nextTick`异步延时显示

## 查询页 search.vue

在 `created()` 中先异步使用 axios 获取数据，然后获取车站相关数据，并且如果路由有接受到参数，则根据参数来赋值 dep, des

路由传参传对象由于 JS 中对象按引用传值，则使用 `JSON.stringify(Object)` 以及 `JSON.parse(String)` 来编码 / 解码

点击 `查询` 按钮的事件：

- 传参给路由 buyticket.vue
- 异步延时删除当前 search.vue 的缓存

图标的制作：(css)

```css
.exchangebutton {
	width: 20px;
	height: 20px; // 大小，会缩放
	vertical-align: bottom; // 对齐位置
	background:url(../assets/exchange.png);
	background-size: 100% 100%;
	background-repeat:no-repeat;
}
```

## 选票页 buyticket.vue

使用 Better-Scroll 来实现选站页的滚动，注意要在组件 `created()` 中最后异步延时进行初始化，并且注册的必须是 wrapper, 并且 content 高度要比 wrapper 高才能起作用

`created()` 中，接受从 search.vue 传来的参数，计算出各种数据，然后调节高度，并且初始化 Better-Scroll

`updated()` 中，动态调节高度，并且刷新 Better-Scroll

使用了 inject 接受父组件方法

---

Better-Scroll 实现下拉刷新：

```js
_initScroll() {
	this.scroll = new BScroll(this.$refs.listwrapper, {
		probeType: 3,
		click: true
	});
	this.scroll.on("touchEnd", (pos) => {
		if (pos.y > 50) {
			setTimeout(() => {
				this.reloadRoute();
				this.showAlertbox("温馨提示", "已刷新!");
				}, 100);
		}
	});
}
```

---

返回 search, 使用路由的 `$router.push`

注意 `$route` 和 `$router`，`$route`用来接受参数， `router` 用来 push 参数

---

交换到发站，使用定义在父组件 App.vue 的方法 `buyticketExchange` 来交换，然后使用父组件 App.vue 的 `reloadRoute` 来刷新

---

```js
if (!event._constructed) {
	return ;
}
```

用于监听点击事件时，Better-Scroll 忽略原始方法

## 选站页 stations.vue

`String.fromCharCode(Number)` 将数字转字符

使用 Better-Scroll 来实现选站页的滚动，注意要在组件 `created()` 中最后异步延时进行初始化

stations.vue 存在时 search.vue 为缓存状态，为了不使 search.vue 数据刷新，使用了 vuex 来存这里的 dep, des。在 search.vue 中加个 watch 来判断是否需要更新

返回键则使用路由传值返回

## 提示框 alertbox.vue, confirmbox.vue

css `align="center"` 可使 div 居中

使用 mixin 来完成 box 的基本方法

## 路由配置

`const routerHistory = createWebHashHistory()` 用于上传 Github Pages 等服务器不支持的历史模式

`const routerHistory = createWebHistory()`  服务器支持的历史模式

## 动态路由缓存

使用 vuex 的全局数据存储一个字符串 `keepAliveList`，使用一个 `mixin` 为所有需要动态路由缓存的组件混入即可

注意 `<keep-alive>`的 `include`属性如果为空则全局缓存，所以添加一个 blank.vue 将其永远占位在里面使得动态缓存生效

注意如果重新缓存，要使用异步延时

在 mixin 里加入一个 watch， 如果 `keepAliveList`变化即检测自身是否还在其中，不在则使用 `this.$detroy` 摧毁自己`

`this.$options`可获取整个的，`this.$options.name` 就是组件里的 `name`

有用的函数：

`String.split(string)`

`Array.includes(string)`

`Array.join(string)`


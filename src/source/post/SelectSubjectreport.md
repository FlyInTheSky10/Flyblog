---
title: Node.js 简单作业选方向应用分析
date: 2021-11-21 21:57
categories:
- cat
tags:
- Node.js
- 后端
---
# 项目简介

简单的作业选方向前后端。

## 开发工具

原生JS

原生Node.js

# 项目分析

前端部分：填写两个文本框和一个单选框，按按钮提交数据

后端部分：接收到前端的数据后，先与本地的 Set 里的数据比较，若存在则驳回提交，不存在则添加，并且保存在本地
<!-- more -->

## 源码分析

### index.html

```html
<form id="form">
	名字 
	<input type="text" name="name">
	<br>
	学号 
	<input type="text" name="id">
	<br>
	<input type="radio" name="fx" id="fx1" value="1"><label for="fx1">机器人</label><br>
	<input type="radio" name="fx" id="fx2" value="2"><label for="fx2">机械</label><br>
	<input type="radio" name="fx" id="fx3" value="3"><label for="fx3">控制</label><br>
	<input type="button" id="submit" value="提交">
</form>
<script type="text/javascript" src="./client.js"></script>
```

### client.js

使用严格模式，绑定按键事件

```js
 "use strict";
let submitDOM = document.getElementById("submit");
let lastTime = new Date();
let flag = 0;
submitDOM.addEventListener("click", submitData);
```

将对象化为`xxx=hhh&yyy=zzz`的形式的函数

```js
function encodeObj(obj) {
	let retdata = "";
	Object.keys(obj).forEach(key => {
		retdata += key + "=" + obj[key] + "&";
	});
	return retdata;
}
```

封装 ajax

```js
function ajax(method, url, val) { // 方法 (POST, GET)，请求路径，传送数据 (encodeObj后的对象)
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = () => { // 收到数据的事件绑定
		if (xhr.readyState == 4) { // 4 传输完毕
			if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) { // 正常
				alert(xhr.responseText);
			} else {
				alert('Request was unsuccessful: ' + xhr.status);
			}
		}
	};
	xhr.open(method, url, true); // 初始化请求 并且异步操作
	if (val) {
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  // 设置类型 urlencoded
		xhr.send(val); // 发送
	} 
}
```

提交数据 (按键绑定事件)：

```js
function submitData() {
	let formDOM = document.getElementById("form");
	let nameDOM = document.getElementsByName("name");
	let idDOM = document.getElementsByName("id");
	let fxDOM = document.getElementsByName("fx"); // getElementsByName 返回数组
	let data = {
		name: nameDOM[0].value,
		id: idDOM[0].value,
		fx: -1
	};
	for (let i = fxDOM.length - 1; i >= 0; --i) {
		if (fxDOM[i].checked) { // radio.checked
			data.fx = fxDOM[i].value;
			break ;
		}
	}
    if (data.name === '' || data.id === '' || data.fx === -1) {
		alert("Not fill enough");
		return ;
	}
	//console.log(data);
	let encodeString = encodeObj(data);
	//console.log(encodeString.substring(0, encodeString.length - 1));
	let nowTime = new Date();
	if (flag && nowTime.getTime() - lastTime.getTime() <= 2000) { // 时间间隔，防止大量提交
		alert("slow!");
	} else {
		ajax("POST", "http://127.0.0.1:3000", encodeString.substring(0, encodeString.length - 1));	
		lastTime = new Date();
		flag = 1;
	}
}
```

### server.js

使用严格模式，导入相关库

```js
"use strict";
let http = require("http");
let qs = require("querystring");
let fs = require("fs");
let url = require("url");
```

初始化数据

```js
let port = 3000;
let students = new Set();
let ids = new Set();
```

文件读入之前储存的数据

```js
fs.readFile("./students", "utf8", (err, data) => {
	let arr = data.split("$");
	for (let i = arr.length - 1; i >= 0; --i) students.add(arr[i]);
});
fs.readFile("./ids", "utf8", (err, data) => {
	let arr = data.split("$");
	for (let i = arr.length - 1; i >= 0; --i) ids.add(arr[i]);
});
```

创建服务器，绑定每次获取到请求的处理程序

```js
let server = http.createServer((req, res) => { // req: 请求数据，res：输出数据
	let data = "";
	req.on("data", d => data += d); // 监听读数据
	req.on("end", () => { // 监听数据结束 (上面的结束)
		let pathname = url.parse(req.url).pathname; // 获取路径
		if (pathname == '/' && req.method == 'GET') { // GET "/"
			res.writeHead(200, {
				"Content-Type": "text/html",
				"Access-Control-Allow-Origin": "*"
			}); // 设置 Header
			fs.readFile("./index.html", "utf8", (err, data) => {
				res.write(data);
				res.end();
			});
			return ;
		}
		if (pathname == '/client.js' && req.method == 'GET') { // GET "/client.js"
			res.writeHead(200, {
				"Content-Type": "text/plain",
				"Access-Control-Allow-Origin": "*"
			});
			fs.readFile("./client.js", "utf8", (err, data) => {
				res.write(data);
				res.end();
			});
			return ;
		}
		let {name, id, fx} = qs.parse(data);
		console.log(`name: ${name}, id: ${id}, fx: ${fx}`);
		if (!name || !id || !fx) {
			res.write("missing params");
			res.end();
			return ;
		}
		res.writeHead(200, {
			"Content-Type": "text/plain",
			"Access-Control-Allow-Origin": "*"
		}); // 设置 Header
		if (!students.has(name) && !ids.has(id)) {
			students.add(name), ids.add(id);
			fs.appendFile("./students", name + "$", err => {});
			fs.appendFile("./ids", id + "$", err => {});  // 写文件
			fs.appendFile("./results", `${name} ${id} ${fx == 1 ? '机器人' : (fx == 2) ? '机械' : '控制'}\n`, err => {});
			res.write(`OK, ${name}(${id})`);
		} else {
			res.write(`No, already submitted, ${name}(${id})`); // 输出数据到客户端
		}
		res.end(); // 结束输出
	});
});
```

服务器监听端口

```js
server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
```


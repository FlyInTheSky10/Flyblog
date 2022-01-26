let barDOM = document.getElementById("bar");
let bodyScroll = function(event) {event.preventDefault();};

let st = 0;
let menuDOM, lowerDOM, lowerDOMTop;
let allhDOMs = [], lastDOM;
window.onscroll = function() {
	st = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset;
	if (lowerDOM && menuDOM) { // 处理目录导航
		if (st >= lowerDOMTop) {
			lowerDOM.style.setProperty("width", lowerDOM.offsetWidth + "px");
			if (menuDOM.offsetHeight >= window.innerHeight - 70) {
				lowerDOM.style.setProperty("height", (window.innerHeight - 10) + "px");
				menuDOM.style.setProperty("height", (window.innerHeight - 70) + "px");
				menuDOM.style.setProperty("overflow", "scroll");
			}
			lowerDOM.style.setProperty("position", "fixed");
			lowerDOM.style.setProperty("top", "0");
			lowerDOM.style.setProperty("margin", "5px 30px 0px 0px");
		} else {
			lowerDOM.style.setProperty("width", null);
			lowerDOM.style.setProperty("height", null);
			menuDOM.style.setProperty("height", null);
			menuDOM.style.setProperty("overflow", null);
			lowerDOM.style.setProperty("position", null);
			lowerDOM.style.setProperty("top", null);
			lowerDOM.style.setProperty("margin", null);
		}
		let flag = 0;
		for (let i = 1; i < allhDOMs.length; ++i) {
			if (allhDOMs[i - 1].position - 15 <= st && st < allhDOMs[i].position - 15) {
				if (lastDOM) lastDOM.className = "item";
				allhDOMs[i - 1].itemDOM.className = "item active";
				let offset = allhDOMs[i - 1].itemDOM.offsetTop - menuDOM.offsetTop + 15;
				if (!(menuDOM.scrollTop <= offset && offset <= menuDOM.scrollTop + menuDOM.offsetHeight)) {
					if (offset >= menuDOM.scrollTop + menuDOM.offsetHeight) menuDOM.scrollTop = offset - menuDOM.offsetHeight + 15;
					else menuDOM.scrollTop = offset;
				}
				lastDOM = allhDOMs[i - 1].itemDOM;
				flag = 1;
				break ;
			}
		}
		if (!flag) {
			if (lastDOM) lastDOM.className = "item";
			allhDOMs[allhDOMs.length - 1].itemDOM.className = "item active";
			let offset = allhDOMs[allhDOMs.length - 1].itemDOM.offsetTop - menuDOM.offsetTop + 15;
			if (!(menuDOM.scrollTop <= offset && offset <= menuDOM.scrollTop + menuDOM.offsetHeight)) {
				if (offset >= menuDOM.scrollTop + menuDOM.offsetHeight) menuDOM.scrollTop = offset - menuDOM.offsetHeight + 15;
				else menuDOM.scrollTop = offset;
			}
			lastDOM = allhDOMs[allhDOMs.length - 1].itemDOM;
		}
	}
} // 移动端要用事件来实时更新

barDOM.onclick = function() {
	bpDOM = document.getElementById("bar-panel");
	pwDOM = document.getElementsByClassName("panel-wrapper")[0];
	bpDOM.style.setProperty("display", null);
	bpDOM.style.setProperty("transform", `translateY(${st}px)`);
	setTimeout(() => pwDOM.style.setProperty(`transform`, `translateX(0px)`), 0);
	document.body.addEventListener("touchmove", bodyScroll, { passive: false });
};

// hide sidebar if width is not enough

checkSidebar();
window.onresize = function() {
	checkSidebar();
	checkCode();
};

function checkSidebar() { // Sidebar
	let clientWidth = document.body.clientWidth;
	let sidebarDOM = document.getElementById("sidebar");
	let barDOM = document.getElementById("bar");
	if (clientWidth < 800) {
		if (sidebarDOM) {
			sidebarDOM.style.setProperty("display", "none");
			sidebarDOM.parentNode.style.setProperty("display", "block");
			sidebarDOM.nextSibling.nextSibling.style.setProperty("width", "100%");
			barDOM.style.setProperty("display", null);
		}
	} else {
		if (sidebarDOM) {
			sidebarDOM.style.setProperty("display", null);
			sidebarDOM.parentNode.style.setProperty("display", "flex");
			sidebarDOM.nextSibling.nextSibling.style.setProperty("width", "0");
			barDOM.style.setProperty("display", "none");
		}
	}
}

// make text in <p> /r/n => <br>

function addLoadEvent(loadEvent) { // 加加载后的事件
	let init = function() {
		if (arguments.callee.done) return;
		arguments.callee.done = true;
		loadEvent.apply(document, arguments);
	};
	if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", init, false);
	}
}

function checkMenu() { // 处理目录导航
	lowerDOM = document.getElementById("lower");
	if (document.getElementsByClassName("postall-wrapper")[0]) {
		if (lowerDOM) {
			lowerDOM.style.setProperty("display", "block");
			lowerDOMTop = lowerDOM.offsetTop;
		}
		let hDOMs = [], flag = 0;
		for (let i = 1; i <= 6; ++i) {
			hDOMs[i] = document.getElementsByTagName(`h${i}`);
			if (hDOMs[i][0]) flag = 1;
		}
		if (!flag) {
			lowerDOM.style.setProperty("display", null);
			return ;
		}

		for (let i = 1; i <= 6; ++i) {
			for (let j = 0; j < hDOMs[i].length; ++j) {
				allhDOMs.push({
					hDOM: hDOMs[i][j],
					level: i,
					position: hDOMs[i][j].offsetTop
				});
			}
		}

		allhDOMs.sort((a, b) => {
			return a.position - b.position;
		});
		//console.log(allhDOMs);

		let content = document.createDocumentFragment();
		for (let i = 0; i < allhDOMs.length; ++i) {
			let now = document.createElement("a");
			now.className = "item";
			now.href = "/";
			let innerContent = "";
			for (let j = 1; j <= allhDOMs[i].level; ++j) innerContent += "&nbsp;&nbsp;&nbsp;&nbsp;";
			innerContent += allhDOMs[i].hDOM.innerHTML;
			now.innerHTML = innerContent;
			now.addEventListener("click", e => {
				e.preventDefault();
				window.scrollTo(document.body.scrollLeft, allhDOMs[i].position);
			});
			allhDOMs[i].itemDOM = now;
			content.appendChild(now);
		}
		//console.log(content);
		menuDOM = document.getElementById("menu");
		if (menuDOM) menuDOM.appendChild(content);

	}
}

function checkCode() { // 格式化 <code> 块
	let codeList = document.getElementsByTagName("code");
	for (let i = 0; i < codeList.length; ++i) {
		let codeDOM = codeList[i];
		let contentDOM = codeDOM.parentNode.parentNode;
		if (codeDOM.parentNode.tagName === "pre") {
			codeDOM.style.setProperty("width", contentDOM.offsetWidth + "px");
			codeDOM.parentNode.style.setProperty("width", contentDOM.offsetWidth + "px");
		} else {
			codeDOM.style.setProperty("width", codeDOM.parentNode.offsetWidth + "px");
		}
		let tmp = codeDOM.innerHTML;
		codeDOM.innerHTML = tmp.replace(/\\\_/g, "\_");
	}
}

addLoadEvent(() => {

	checkSidebar();

	// <p> 内换行
	let pList = document.getElementsByTagName("p");
	for (let i = 0; i < pList.length; ++i) {
		let pDOM = pList[i];
		pDOM.innerHTML = pDOM.innerHTML.replace(/[\r\n]/g, "<br>");
	}

	setTimeout(() => {checkCode();});

	// 加载动画
	let pwDOM = document.getElementsByClassName("postlist-wrapper")[0];
	pwDOM.style.setProperty("visibility", null);
	pwDOM.style.setProperty("opacity", 1);

	barDOM.style.setProperty(`left`, `${document.body.offsetWidth - 80}px`);

	setTimeout(() => {checkMenu();});

});

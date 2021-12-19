let barDOM = document.getElementById("bar");
let bodyScroll = function(event) {event.preventDefault();};

let st = 0;
window.onscroll = function() {
	st = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset;
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

function checkSidebar() {
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

function addLoadEvent(loadEvent) {
	let init = function() {
		if (arguments.callee.done) return;
		arguments.callee.done = true;
		loadEvent.apply(document, arguments);
	};
	if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", init, false);
	}
}

function checkCode() {
	let codeList = document.getElementsByTagName("code");
	for (let i = 0; i < codeList.length; ++i) {
		let codeDOM = codeList[i];
		let contentDOM = codeDOM.parentNode.parentNode;
		if (codeDOM.parentNode.tagName === "pre") {
			codeDOM.style.setProperty("width", contentDOM.offsetWidth + "px");
			codeDOM.parentNode.style.setProperty("width", contentDOM.offsetWidth + "px");
		} else {
			codeDOM.style.setProperty("width", codeDOM.parentNode.offsetWidth + "px");
			codeDOM.style.setProperty("border", "solid #eaeaea");
		}
		let tmp = codeDOM.innerHTML;
		codeDOM.innerHTML = tmp.replace(/\\\_/g, "\_");
	}
}

addLoadEvent(() => {

	checkSidebar();

	let pList = document.getElementsByTagName("p");
	for (let i = 0; i < pList.length; ++i) {
		let pDOM = pList[i];
		pDOM.innerHTML = pDOM.innerHTML.replace(/[\r\n]/g, "<br>");
	}

	setTimeout(() => {checkCode();});

	let pwDOM = document.getElementsByClassName("postlist-wrapper")[0];
	pwDOM.style.setProperty("visibility", null);
	pwDOM.style.setProperty("opacity", 1);

	barDOM.style.setProperty(`left`, `${document.body.offsetWidth - 80}px`);

});

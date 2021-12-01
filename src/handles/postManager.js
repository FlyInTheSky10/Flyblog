"use strict";

let fs = require("fs");
let path = require("path");
let infoHelper = require("../utils/infoHelper");

module.exports = (function() {
	
	let postInfoList = [];
	let tagsMap = {};
	let tagList = new Set();
	let flag = false;
	
	function checkInit() {
		if (!flag) throw "Error: postManager doesn't init!";
	};
	
	return {
		initPostList() { // init the post info
			let fileList = fs.readdirSync(path.resolve(__dirname, "../source/post"));
			for (let i = 0; i < fileList.length; ++i) {
				postInfoList[i] = infoHelper.getInfoFromMarked(fileList[i], "post");
			}
			postInfoList.sort((a, b) => {
				if (a.date > b.date) return -1;
				return 1;
			});
			for (let i = 0; i < postInfoList.length; ++i) {
				for (let j = 0; j < postInfoList[i].tags.length; ++j) {
					if (!tagsMap[postInfoList[i].tags[j]]) tagsMap[postInfoList[i].tags[j]] = [];
					tagsMap[postInfoList[i].tags[j]].push(postInfoList[i]);
					tagList.add(postInfoList[i].tags[j]);
				}
			}
			flag = true;
			let that = this;
			return that;
		},
		getPostListByTagName(tagName, l, r) { // return an array: [ postInfo ]
			checkInit();
			if (!tagList.has(tagName)) throw "Error: this tagName doesn't exist!";
			if (l > r || r >= tagsMap[tagName].length) throw `Error: range[${l}, ${r}] is illegal!`;
			return tagsMap[tagName].slice(l, r + 1);
		},
		getTagList() { // return an array: [ tagName ]
			checkInit();
			return [...tagList];
		},
		getPostList(l, r) { // return an array: [ postInfo ]
			checkInit();
			if (l > r || r >= postInfoList.length) throw `Error: range[${l}, ${r}] is illegal!`;
			return postInfoList.slice(l, r + 1);
		},
		getPostCount() { // return a Number
			checkInit();
			return postInfoList.length;
		},
		getPostCountByTagName(tagName) {
			checkInit();
			return tagsMap[tagName].length;
		}
	};
})();
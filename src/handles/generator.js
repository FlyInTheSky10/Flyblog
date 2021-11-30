"use strict";

let fs = require("fs");
let path = require("path");
let infoHelper = require("../utils/infoHelper");
let ejsHelper = require("../utils/ejsHelper");
let staticHelper = require("../utils/staticHelper");
let postManager = require("./postManager");
let markedHelper = require("../utils/markedHelper");

module.exports = (function() {
	
	let flag = false;
	let pageCount = 0;
	
	function checkInit() {
		if (!flag) throw "Error: postManager doesn't init!";
	};
	function getPostlistByRange(l, r) { // return postlist [ post ]
		if (l > r) throw `Error: range[${l}, ${r}] is illegal!`;
		let raw = postManager.getPostList(l, r);
		let returnPostlist = [];
		for (let i = 0; i < raw.length; ++i) {
			returnPostlist[i] = {};
			Object.assign(returnPostlist[i], raw[i]);
			returnPostlist[i].intro = markedHelper.getIntroFromFileName(raw[i].fileName);
		}
		return returnPostlist;
	};
	
	return {
		init() { // init
			fs.mkdirSync(path.resolve(__dirname, "../../public"), { recursive: true });
			fs.mkdirSync(path.resolve(__dirname, "../../public/static"), { recursive: true });
			fs.mkdirSync(path.resolve(__dirname, "../../public/static/css"), { recursive: true });
			fs.mkdirSync(path.resolve(__dirname, "../../public/static/js"), { recursive: true });
			fs.mkdirSync(path.resolve(__dirname, "../../public/static/images"), { recursive: true });
			fs.mkdirSync(path.resolve(__dirname, "../../public/page"), { recursive: true });
			fs.mkdirSync(path.resolve(__dirname, "../../public/tags"), { recursive: true });
			fs.mkdirSync(path.resolve(__dirname, "../../public/tags/page"), { recursive: true }); // make dir
			staticHelper.exportStaticAsset("css");
			staticHelper.exportStaticAsset("js");
			staticHelper.exportStaticAsset("images"); // export static files
			postManager.initPostList();
			fs.writeFileSync(path.resolve(__dirname, "../../public/404.html"), "404 Not Found");
			flag = true;
			let that = this;
			return that;
		},
		generatePostPage() {
			
		},
		async generateIndexPage() {
			checkInit();
			let config = infoHelper.getConfig();
			let postCount = postManager.getPostCount(), maxPostNumber = 10;
			for (let l = 0; l < postCount; l += maxPostNumber) {
				pageCount++;
				let r = l + maxPostNumber - 1;
				if (r >= postCount) r = postCount - 1;
				if (r < l) break ;
				let postlist = getPostlistByRange(l, r);
				
				let html;
				await ejsHelper.renderIndexPage(config, postlist, pageCount, r == postCount - 1).then(data => html = data);
				
				let dir = "../../public/";
				if (pageCount == 1) {
					dir += "index.html";
				} else {
					fs.mkdirSync(path.resolve(__dirname, dir + `page/${pageCount}`), { recursive: true });
					dir += `page/${pageCount}/index.html`;
				}
				
				console.log(`generating: ${path.resolve(__dirname, dir)}`);
				
				fs.writeFile(path.resolve(__dirname, dir), html, err => {
					if (err) throw err;
				});
			}
			
			console.log(`generate indexPage done, generated ${pageCount} pages.`);
			
			let that = this;
			return that;
		},
		generateTagsPage() {
			
		},
		generateOtherPage(pageName) {
			
		},
		getPageCount() {
			return pageCount;
		}
	};
})();
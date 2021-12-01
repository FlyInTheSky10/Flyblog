"use strict";

let fs = require("fs");
let path = require("path");
let ejs = require("ejs");

module.exports = (function() {
	return {
		// return rendered page html sources
		renderPostPage(config, post) { // post: {title, date, fileName, tags, content}
			return ejs.renderFile(path.resolve(__dirname, "../layout/post.ejs"), { config, post }, {async: false});
		},
		renderIndexPage(config, postlist, pagecode, lastpage) {
			return ejs.renderFile(path.resolve(__dirname, "../layout/index.ejs"), { config, post: undefined, postlist, pagecode, lastpage }, {async: false});
		},
		renderTagsPage() {
			
		},
		renderOtherPage(pageName) {
			
		}
	};
})();
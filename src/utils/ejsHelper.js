"use strict";

let fs = require("fs");
let path = require("path");
let ejs = require("ejs");

module.exports = (function() {
	return {
		// return rendered page html sources
		renderPostPage() {
			
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
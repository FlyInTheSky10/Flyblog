"use strict";

let fs = require("fs");
let path = require("path");
let ejs = require("ejs");

module.exports = (function() {
    return {
        renderPostPage(config, post) { // post: {title, date, fileName, tags, content}
            return ejs.renderFile(path.resolve(__dirname, "../layout/post.ejs"), { config, post }, {async: false});
        },
        renderIndexPage(config, postlist, pagecode, lastpage) {
            return ejs.renderFile(path.resolve(__dirname, "../layout/index.ejs"), { config, post: undefined, postlist, pagecode, lastpage }, {async: false});
        },
        renderTagsPage(config, tagList) {
            return ejs.renderFile(path.resolve(__dirname, "../layout/tags.ejs"), { config, post: { title: "标签" }, tagList }, {async: false});
        },
        renderTagListPage(config, tagName, postlist, pagecode, lastpage) {
            return ejs.renderFile(path.resolve(__dirname, "../layout/taglist.ejs"),
            { config, post: { title: `标签: ${tagName}` }, postlist, pagecode, lastpage, tagName }, {async: false});
        },
        renderOtherPage(config, title, content) {
            return ejs.renderFile(path.resolve(__dirname, "../layout/other.ejs"), { config, post: { title }, content }, {async: false});
        }
    };
})();
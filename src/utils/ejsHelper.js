"use strict";

let fs = require("fs");
let path = require("path");
let ejs = require("ejs");

module.exports = (function() {
    return {
        /**
          * Get post page HTML from the information.
          * @returns {String} post page HTML
         */
        renderPostPage(config, post) {
            return ejs.renderFile(path.resolve(__dirname, "../layout/post.ejs"), { config, post }, {async: false});
        },
        /**
         * Get index page HTML from the information.
         * @returns {String} index page HTML
         */
        renderIndexPage(config, postList, pageCode, lastPage) {
            return ejs.renderFile(path.resolve(__dirname, "../layout/index.ejs"), { config, post: undefined, postList, pageCode, lastPage }, {async: false});
        },
        /**
         * Get tags page HTML from the information.
         * @returns {String} tags page HTML
         */
        renderTagsPage(config, tagList) {
            return ejs.renderFile(path.resolve(__dirname, "../layout/tags.ejs"), { config, post: { title: "标签" }, tagList }, {async: false});
        },
        /**
         * Get tag list page HTML from the information.
         * @returns {String} tags list page HTML
         */
        renderTagListPage(config, tagName, postList, pageCode, lastPage) {
            return ejs.renderFile(path.resolve(__dirname, "../layout/taglist.ejs"),
            { config, post: { title: `标签: ${tagName}` }, postList, pageCode, lastPage, tagName }, {async: false});
        },
        /**
         * Get other page HTML from the information.
         * @returns {String} other page HTML
         */
        renderOtherPage(config, title, content) {
            return ejs.renderFile(path.resolve(__dirname, "../layout/other.ejs"), { config, post: { title }, content }, {async: false});
        }
    };
})();
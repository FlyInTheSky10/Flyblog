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
        /**
         * Initiative the post manager.
         */
        initPostList() {
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
        /**
         * Get post list by tag name and range[l, r].
         * @returns {Object[]} post list
         */
        getPostListByTagName(tagName, l, r) {
            checkInit();
            if (!tagList.has(tagName)) throw "Error: this tagName doesn't exist!";
            if (l > r || r >= tagsMap[tagName].length) throw `Error: range[${l}, ${r}] is illegal!`;
            return tagsMap[tagName].slice(l, r + 1);
        },
        /**
         * Get tag list.
         * @returns {String[]} tag list
         */
        getTagList() {
            checkInit();
            return [...tagList];
        },
        /**
         * Get post list by range[l, r].
         * @returns {Object[]} post list
         */
        getPostList(l, r) {
            checkInit();
            if (l > r || r >= postInfoList.length) throw `Error: range[${l}, ${r}] is illegal!`;
            return postInfoList.slice(l, r + 1);
        },
        /**
         * Get the number of posts.
         * @returns {Number} the number of posts
         */
        getPostCount() {
            checkInit();
            return postInfoList.length;
        },
        /**
         * Get the number of posts in tag.
         * @returns {Number} the number of posts in tag
         */
        getPostCountByTagName(tagName) {
            checkInit();
            return tagsMap[tagName].length;
        }
    };
})();
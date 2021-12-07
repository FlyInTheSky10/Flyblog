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
    let pageIndexCount = 0;
    let pageTagCount = {};

    function checkInit() {
        if (!flag) throw "Error: postManager doesn't init!";
    };
    function getPostlistByRange(l, r) {
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
        /**
         * Initiative the generator.
         */
        init() {
            fs.mkdirSync(path.resolve(__dirname, "../../public"), { recursive: true });
            fs.mkdirSync(path.resolve(__dirname, "../../public/static"), { recursive: true });
            fs.mkdirSync(path.resolve(__dirname, "../../public/static/css"), { recursive: true });
            fs.mkdirSync(path.resolve(__dirname, "../../public/static/js"), { recursive: true });
            fs.mkdirSync(path.resolve(__dirname, "../../public/static/images"), { recursive: true });
            fs.mkdirSync(path.resolve(__dirname, "../../public/page"), { recursive: true });
            fs.mkdirSync(path.resolve(__dirname, "../../public/tag"), { recursive: true }); // make dir
            staticHelper.exportStaticAsset("css");
            staticHelper.exportStaticAsset("js");
            staticHelper.exportStaticAsset("images"); // export static files
            postManager.initPostList();

            fs.writeFileSync(path.resolve(__dirname, "../../public/404.html"), "404 Not Found");
            let faviconData = fs.readFileSync(path.resolve(__dirname, "../source/favicon.ico"));
            fs.writeFileSync(path.resolve(__dirname, "../../public/favicon.ico"), faviconData);

            flag = true;
            let that = this;
            return that;
        },
        /**
         * Generate all post pages to public folder.
         * @returns {Promise<void>}
         */
        async generatePostPage() {
            checkInit();
            let config = infoHelper.getConfig();
            let postCount = postManager.getPostCount();
            let postList = postManager.getPostList(0, postCount - 1);
            for (let i = 0; i < postCount; ++i) {

                let nowPostFileName = postList[i].fileName;
                let nowPostObject = {
                    content: markedHelper.getHTMLFromMarked(nowPostFileName, "post")
                };
                Object.assign(nowPostObject, postList[i]);

                let html;
                await ejsHelper.renderPostPage(config, nowPostObject).then(data => html = data);

                let postPath;
                for (let i = nowPostFileName.length - 1; i >= 0; --i) {
                    if (nowPostFileName[i] == '.') {
                        postPath = nowPostFileName.substring(0, i);
                        break ;
                    }
                }

                let dir = `../../public/${postPath}/`;
                fs.mkdirSync(path.resolve(__dirname, dir), { recursive: true });

                fs.writeFile(path.resolve(__dirname, dir + "index.html"), html, err => {
                    if (err) throw err;
                });
            }
            console.log(`Generating post pages done, generated ${postCount} pages.`);
        },
        /**
         * Generate all index pages to public folder.
         * @returns {Promise<void>}
         */
        async generateIndexPage() {
            checkInit();
            let config = infoHelper.getConfig();
            let postCount = postManager.getPostCount(), maxPostNumber = 10;
            for (let l = 0; l < postCount; l += maxPostNumber) {
                pageIndexCount++;
                let r = l + maxPostNumber - 1;
                if (r >= postCount) r = postCount - 1;
                if (r < l) break ;
                let postlist = getPostlistByRange(l, r);

                let html;
                await ejsHelper.renderIndexPage(config, postlist, pageIndexCount, r == postCount - 1).then(data => html = data);

                let dir = "../../public/";
                if (pageIndexCount == 1) {
                    dir += "index.html";
                } else {
                    fs.mkdirSync(path.resolve(__dirname, dir + `page/${pageIndexCount}`), { recursive: true });
                    dir += `page/${pageIndexCount}/index.html`;
                }

                console.log(`generating: ${path.resolve(__dirname, dir)}`);

                fs.writeFile(path.resolve(__dirname, dir), html, err => {
                    if (err) throw err;
                });
            }

            console.log(`Generating index pages done, generated ${pageIndexCount} pages.`);

            let that = this;
            return that;
        },
        /**
         * Generate all tags pages to public folder.
         * @returns {Promise<void>}
         */
        async generateTagsPage() {
            checkInit();
            let config = infoHelper.getConfig();
            let tagList = postManager.getTagList();

            let html;
            await ejsHelper.renderTagsPage(config, tagList).then(data => html = data);

            let dir = "../../public/tag/index.html";

            console.log(`generating: ${path.resolve(__dirname, dir)}`);

            fs.writeFile(path.resolve(__dirname, dir), html, err => {
                if (err) throw err;
            });

            for (let i = 0; i < tagList.length; ++i) {

                let tagName = tagList[i];
                let postCount = postManager.getPostCountByTagName(tagName);
                let maxPostNumber = 10;

                pageTagCount[tagName] = 0;

                console.log(`generating: ${path.resolve(__dirname, `../../public/tag/${tagName}/`)}`);

                for (let l = 0; l < postCount; l += maxPostNumber) {
                    pageTagCount[tagName]++;
                    let r = l + maxPostNumber - 1;
                    if (r >= postCount) r = postCount - 1;
                    if (r < l) break ;
                    let postlist = postManager.getPostListByTagName(tagName, l, r);

                    let html;
                    await ejsHelper.renderTagListPage(config, tagName, postlist, pageTagCount[tagName], r == postCount - 1).then(data => html = data);

                    let dir = `../../public/tag/${tagName}/`;
                    fs.mkdirSync(path.resolve(__dirname, dir), { recursive: true });

                    if (pageTagCount[tagName] == 1) {
                        dir += "index.html";
                    } else {
                        fs.mkdirSync(path.resolve(__dirname, dir + `page/${pageTagCount[tagName]}`), { recursive: true });
                        dir += `page/${pageTagCount[tagName]}/index.html`;
                    }

                    fs.writeFile(path.resolve(__dirname, dir), html, err => {
                        if (err) throw err;
                    });

                }
            }

            console.log(`Generating tag pages done.`);

        },
        /**
         * Generate all other pages to public folder.
         * @returns {Promise<void>}
         */
        async generateOtherPage() {
            checkInit();

            let config = infoHelper.getConfig();

            for (let i = 0; i < config.pages.length; ++i) {

                let {title, fileName} = config.pages[i];
                let content = markedHelper.getHTMLFromMarked(fileName + ".md", "page");


                let html;
                await ejsHelper.renderOtherPage(config, title, content).then(data => html = data);

                let dir = `../../public/${fileName}/`;
                fs.mkdirSync(path.resolve(__dirname, dir), { recursive: true });

                dir += "index.html";
                console.log(`generating: ${path.resolve(__dirname, dir)}`);
                fs.writeFile(path.resolve(__dirname, dir), html, err => {
                    if (err) throw err;
                });

            }

            console.log(`Generating custom pages done.`);

        },
        /**
         * Get the number of index pages
         * @returns {number} the number of index pages
         */
        getIndexPageCount() {
            return pageIndexCount;
        },
        /**
         * Get the number of tag pages
         * @returns {number} the number of tag pages
         */
        getPageTagCount(tagName) {
            return pageTagCount[tagName];
        },
    };
})();
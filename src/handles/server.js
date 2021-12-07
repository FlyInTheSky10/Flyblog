"use strict";

let fs = require("fs");
let http = require("http");
let url = require("url");
let path = require("path");
let infoHelper = require("../utils/infoHelper");
let staticHelper = require("../utils/staticHelper");
let generator = require("./generator");
let postManager = require("./postManager");

module.exports = (function() {

    let port = infoHelper.getConfig().port || process.env.PORT || 3000;
    let server;
    let routeHandle = function(pathname, filename, res, done) {
        if (pathname + filename == "/index.html") {
            sendData(`${staticHelper.getPublicPath()}/index.html`, "text/html", res);
            done = true;
            return ;
        }
        if (!done) sendData(`${staticHelper.getPublicPath()}/404.html`, "text/html", res);
    };

    function sendData(dir, type, res) {
        res.writeHead(200, {
            "Content-Type": type,
            "Access-Control-Allow-Origin": "*"
        });
        fs.readFile(path.resolve(__dirname, dir), (type.search("image") != -1) ? undefined : "utf8", (err, data) => {
            if (err) throw err;
            res.write(data);
            res.end();
        });
    };
    function addRouteHandle(dir, type, suffix) {
        let oldf = routeHandle;
        routeHandle = (pathname, filename, res, done) => {
            if (pathname === dir) {
                let ns;
                for (let i = filename.length - 1; i >= 0; --i) {
                    if (filename[i] == '.') {
                        ns = filename.substring(i + 1, filename.length);
                        break ;
                    }
                }
                //console.log(ns);
                if (ns === suffix) {
                    sendData(`${staticHelper.getPublicPath()}${pathname + filename}`, type, res);
                    done = true;
                    return ;
                }
            }
            oldf(pathname, filename, res, done);
        }
    };
    function runServer() {
        server.listen(port, () => {
            console.log(`Flyblog server running at: http://${infoHelper.getHostName()}:${port}/`);
        });
    }

    return {
        /**
         * Set server port to new one.
         */
        setPort(newport) {
            port = newport;
        },
        /**
         * Get server port.
         * @returns {number}
         */
        getPort() {
            return port;
        },
        /**
         * Start the server.
         */
        start() {

            infoHelper.setServerMode();
            generator.init();

            let genPro = [], routePro;
            genPro.push(generator.generateIndexPage());
            genPro.push(generator.generatePostPage());
            genPro.push(generator.generateTagsPage());
            genPro.push(generator.generateOtherPage());

            server = http.createServer((req, res) => {
                let data = "";
                req.on("data", d => data += d);
                req.on("end", () => {
                    let pathname = url.parse(req.url).pathname;
                    let filename;
                    if (pathname[pathname.length - 1] == "/") {
                        filename = "index.html";
                    } else {
                        for (let i = pathname.length - 1; i >= 0; --i) {
                            if (pathname[i] == "/") {
                                filename = pathname.substring(i + 1, pathname.length);
                                pathname = pathname.substring(0, i + 1);
                                break ;
                            }
                        }
                    }
                    //console.log(`pathname: ${pathname}, filename: ${filename}`);
                    routeHandle(decodeURIComponent(pathname), filename, res, false);
                });
            });

            addRouteHandle("/", "image/x-icon", "ico");

            addRouteHandle("/static/css/", "text/css", "css");
            addRouteHandle("/static/js/", "	application/x-javascript", "js");
            addRouteHandle("/static/images/", "image/jpeg", "jpg");
            addRouteHandle("/static/images/", "image/png", "png");

            routePro = Promise.all(genPro).then(() => {

                for (let i = 2; i <= generator.getIndexPageCount(); ++i) {
                    addRouteHandle(`/page/${i}/`, "text/html", "html");
                }

                let arr = postManager.getPostList(0, postManager.getPostCount() - 1);
                for (let i = 0; i < postManager.getPostCount(); ++i) {
                    let fileName = arr[i].fileName, postPath;
                    for (let j = fileName.length - 1; j >= 0; --j) {
                        if (fileName[j] == '.') {
                            postPath = fileName.substring(0, j);
                            break ;
                        }
                    }
                    addRouteHandle(`/${postPath}/`, "text/html", "html");
                }

                addRouteHandle(`/tag/`, "text/html", "html");

                let tagList = postManager.getTagList();
                for (let k = 0; k < tagList.length; ++k) {
                    let tagName = tagList[k];
                    addRouteHandle(`/tag/${tagName}/`, "text/html", "html");
                    for (let i = 2; i <= generator.getPageTagCount(tagName); ++i) {
                        addRouteHandle(`/tag/${tagName}/page/${i}/`, "text/html", "html");
                    }
                }

                let { pages } = infoHelper.getConfig();
                for (let i = 0; i < pages.length; ++i) {
                    let { fileName } = pages[i];
                    addRouteHandle(`/${fileName}/`, "text/html", "html");
                }

                console.log("Server route done.");

            }); // wait all gernerator finished
            routePro.then(() => {
                console.log("Server all initialized.");
                runServer();
            }); // wait all route added
        }
    };

})();
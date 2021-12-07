"use strict";

let path = require("path");
let fs = require("fs");

module.exports = (function() {

    let publicPath = path.resolve(__dirname, "../../public");

    return {
        /**
         * Get the public folder's path.
         * @returns {string} public folder's path
         */
        getPublicPath() {
            return publicPath;
        },
        /**
         * Export static assets by directory name.
         */
        exportStaticAsset(dirName) {
            let that = this;
            let workpath = path.resolve(__dirname, "../assets/" + dirName);
            let topath = path.resolve(__dirname, that.getPublicPath() + "/static/" + dirName);
            let fileList = fs.readdirSync(workpath);
            for (let i = 0; i < fileList.length; ++i) {
                fs.readFile(workpath + "/" + fileList[i], dirName === "images" ? null : "utf8", (err, data) => {
                    if (err) throw err;
                    fs.writeFile(topath + "/" + fileList[i], data, err => {
                        if (err) throw err;
                    });
                });
            }
        }
    }
})();
"use strict";
const { marked } = require("marked");
const fs = require("fs");
const path = require("path"); 

const sourceDir = "../source";

module.exports = (function() {
    return {
        /**
         * Get HTML from markdown by file name and type.
         * @returns {string} HTML
         */
        getHTMLFromMarked(fileName, type) {
            let typeDir = sourceDir + "/" + type;
            let fileDir = typeDir + "/" + fileName;
            //console.log(fileDir);
            let dataMd = fs.readFileSync(path.resolve(__dirname, fileDir), "utf8");
            dataMd = dataMd.replace(/[\_]/g, "\_");
            let dataHtml = marked.parse(dataMd);
            let count = 0;
            for (let i = 0; i < dataHtml.length; ++i) {
                if (dataHtml.substring(i, i + 4) == "<hr>") {
                    ++count;
                    if (count == 2) {
                        dataHtml = dataHtml.substring(i + 5, dataHtml.length);
                        break ;
                    }
                }
            } // delete head
            return dataHtml;
        },
        /**
         * Get HTML introduction from markdown by file name and type.
         * @returns {string} HTML introduction
         */
        getIntroFromFileName(fileName) {
            let that = this;
            let dataHtml = that.getHTMLFromMarked(fileName, "post");
            for (let i = 0; i < dataHtml.length; ++i) {
                if (dataHtml.substring(i, i + 13) == "<!-- more -->") {
                    return dataHtml.substring(0, i);
                    break ;
                }
            }
        }
    };
})();
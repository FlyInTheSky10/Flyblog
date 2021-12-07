"use strict";
const { marked } = require("marked");
const fs = require("fs");
const path = require("path"); 

const sourceDir = "../source";

module.exports = (function() {
    return {
        getHtmlFromMarked(fileName, type) { // return html source form markdown
            let typeDir = sourceDir + "/" + type;
            let fileDir = typeDir + "/" + fileName;
            //console.log(fileDir);
            let dataMd = fs.readFileSync(path.resolve(__dirname, fileDir), "utf8");
            dataMd = dataMd.replace(/[\_]/g, "\\_");
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
        getIntroFromFileName(fileName) { // return html introduction from fileName
            let that = this;
            let dataHtml = that.getHtmlFromMarked(fileName, "post");
            for (let i = 0; i < dataHtml.length; ++i) {
                if (dataHtml.substring(i, i + 13) == "<!-- more -->") {
                    return dataHtml.substring(0, i);
                    break ;
                }
            }
        }
    };
})();
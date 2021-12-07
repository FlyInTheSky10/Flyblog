"use strict";
const fs = require("fs");
const path = require("path"); 
const osHelper = require("./osHelper"); 

let sourceDir = "../source";

module.exports = (function() {

    let config = "";
    let hostname = "";

    return {
        getInfoFromMarked(fileName, type) { // return post info: {title, date, fileName, tags};
            let typeDir = sourceDir + "/" + type;
            let fileDir = typeDir + "/" + fileName;
            let dataMd = fs.readFileSync(path.resolve(__dirname, fileDir), "utf8");
            let count = 0, len = dataMd.length, endPos = 0;
            for (let i = 0; i < len - 2; ++i) {
                if (dataMd[i] == dataMd[i + 1] && dataMd[i + 1] == dataMd[i + 2] && dataMd[i + 2] == '-') {
                    ++count;
                    if (count == 2) {
                        endPos = i;
                        break ;
                    }
                }
            }
            let sepData = dataMd.substring(4, endPos - 1); // abstract head
            let info = {
                title: "",
                date: undefined,
                fileName,
                tags: []
            };
            for (let i = 0; i < sepData.length; ++i) {
                if (sepData[i] == ':') {
                    if (sepData.substring(i - 5, i) == "title") {
                        for (let j = i; j < sepData.length; ++j) {
                            if (sepData.substring(j, j + 5) == "date:") {
                                info.title = sepData.substring(i + 2, j - 1);
                            }
                        }
                    }
                    if (sepData.substring(i - 4, i) == "date") {
                        for (let j = i; j < sepData.length; ++j) {
                            if (sepData.substring(j, j + 11) == "categories:") {
                                info.date = new Date(sepData.substring(i + 2, j - 1));
                                //console.log(info.date.toDateString());
                            }
                        }
                    }
                    if (sepData.substring(i - 4, i) == "tags") {
                        info.tags = sepData.substring(i, sepData.length).replace(/[\r\n]/g,"").replace(/[\n]/g,"").split("- ");
                        info.tags.splice(0, 1);
                        for (let i = 0; i < info.tags.length; ++i) {
                            info.tags[i] = info.tags[i].replace(/[/*]/g,"").replace(/[<]/g,"").replace(/[>]/g,"").replace(/[|]/g,"").replace(/[?]/g,"");
                        }
                    }
                }
            } // return post head object
            return info;
        },
        getConfig() { // get blog config.json: {title, subtitle, author, description, rootpath, pages}
            if (config != "") {
                return config;
            } else {
                let dataConf = fs.readFileSync(path.resolve(__dirname, "../../config.json"), "utf8");
                config = JSON.parse(dataConf);
                return config;
            }
        },
        serverMode() {
            let that = this;
            that.getConfig();
            hostname = osHelper.getIpAddress() || "localhost";
            config.rootpath = `http://${hostname}:${config.port}`;
        },
        getHostName() {
            return hostname;
        }
    };
})();
#!/usr/bin/env node
"use strict";

let opr = process.argv[2];
if (opr === "g" || opr === "generate") {

    let generator = require("./handles/generator");
    generator.init();

    let genPro = [];
    genPro.push(generator.generateIndexPage());
    genPro.push(generator.generatePostPage());
    genPro.push(generator.generateTagsPage());
    genPro.push(generator.generateOtherPage());

    Promise.all(genPro).then(() => {
        console.log(`Generating finished. Upload "/public" fold.`);
    });

} else if (opr === "s" || opr === "server") {

    let server = require("./handles/server");
    server.start();

} else if (opr === "c" || opr === "clean") {

    let path = require("path"), fs = require("fs"), osHelper = require("./utils/osHelper");
    let dir = path.resolve(__dirname, "../public");
    fs.exists(dir, exist => {
        if (exist) {
            osHelper.deleteAllFileByDir(dir);
            console.log(`Cleaning "${dir}" fold finished.`);
        } else {
            console.log(`Can't find "${dir}" fold!`);
        }
    });

} else {
    console.log("Unknown command. Please check your input.");
}
#!/usr/bin/env node
"use strict";

let server = require("./handles/server");

let opr = process.argv[2];
if (opr === "g" || opr === "generate") {
	//let markedHelper = require("./utils/markedHelper");
	//console.log(markedHelper.getHtmlFromMarked("szLISLCS.md", "post"));
	//console.log(markedHelper.getIntroFromFileName("szLISLCS.md"));
	//let infoHelper = require("./utils/infoHelper");
	//console.log(infoHelper.getInfoFromMarked("szLISLCS.md", "post"));
	//console.log(infoHelper.getConfig());
	//let postManager = require("./handles/postManager");
	//console.log(postManager.initPostList().getPostListByTagName("第三方说过话", 0, 0));
} else if (opr === "s" || opr === "server") {
	server.start();
} else {
	console.log("Unknown command. Please check your input.");
}
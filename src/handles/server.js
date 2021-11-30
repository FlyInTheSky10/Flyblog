"use strict";

let fs = require("fs");
let http = require("http");
let url = require("url");
let path = require("path");
let infoHelper = require("../utils/infoHelper");
let staticHelper = require("../utils/staticHelper");
let generator = require("./generator");

module.exports = (function() {
	
	let port = infoHelper.getConfig().port || process.env.PORT || 3000;
	let server;
	let routeHandle = function(pathname, filename, res, done) {
		if (pathname + filename == "/index.html") {
			sendData(`${staticHelper.publicPath()}/index.html`, "text/html", res);
			done = true;
			return ;
		}
		if (!done) sendData(`${staticHelper.publicPath()}/404.html`, "text/html", res);
	};
	
	function sendData(dir, type, res) {
		res.writeHead(200, {
			"Content-Type": type, 
			"Access-Control-Allow-Origin": "*"
		});
		fs.readFile(path.resolve(__dirname, dir), type == "image/jpeg" ? undefined : type === "image/png" ? undefined : "utf8", (err, data) => {
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
					sendData(`${staticHelper.publicPath()}${pathname + filename}`, type, res);
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
		setPort(newport) {
			port = newport;
		},
		getPort() {
			return port;
		},
		start() {
			
			infoHelper.serverMode();
			generator.init();
			
			let genPro = [], routePro = [];
			genPro.push(generator.generateIndexPage());
			
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
					routeHandle(pathname, filename, res, false);
				});
			});
			
			addRouteHandle("/static/css/", "text/css", "css");
			addRouteHandle("/static/images/", "image/jpeg", "jpg");
			addRouteHandle("/static/images/", "image/png", "png");
			
			routePro.push(Promise.all(genPro).then(() => {
				for (let i = 2; i <= generator.getPageCount(); ++i) {
					addRouteHandle(`/page/${i}/`, "text/html", "html");
				}
			})); // wait all gernerator finished
			Promise.all(routePro).then(() => {
				runServer();
			}); // wait all route added
		}
	};
	
})();
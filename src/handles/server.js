"use strict";

let http = require("http");

module.exports = (function() {
	
	let port = process.env.PORT || 3000;
	let server;
	
	bindServerRoute(f) {
		server = http.createServer((req, res) => {
			// parse
		});
	}
	
	return {
		setPort(newport) {
			port = newport;
		},
		getPort() {
			return port;
		},
		setServer() {
			
		},
		runServer() {
			server.listen(port, () => {
				console.log(`Flyblog server running at port: ${port}`);
			});
		}
	};
	
})();
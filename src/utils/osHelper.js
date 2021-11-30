let os = require("os");

module.exports = (function() {
	return {
		getIpAddress() {
			let ifaces = os.networkInterfaces();
			for (let e in ifaces) {
				let iface = ifaces[e];
				for (let j = 0; j < iface.length; j++) {
					let {family, address, internal} = iface[j];
					if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
						return address;
					}
				}
			}
		}
	}
})();
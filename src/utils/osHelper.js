let os = require("os");
let fs = require("fs");

module.exports = (function() {
    return {
        /**
         * Get local IP address.
         * @returns {string} IP address
         */
        getIPAddress() {
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
        },
        /**
         * Delete directory.
         */
        deleteAllFileByDir(root) {
            let that = this;
            let lst = fs.readdirSync(root);
            for (let i = 0; i < lst.length; ++i) {
                let nowPath = root + "/" + lst[i];
                if (fs.statSync(nowPath).isFile()) {
                    fs.unlinkSync(nowPath);
                } else {
                    that.deleteAllFileByDir(nowPath);
                }
            }
            fs.rmdirSync(root);
        }
    }
})();
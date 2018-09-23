const AbstractServer = require("./abstract");
const HTTP = require("http");
const pify = require("pify");

module.exports = class HTTPServer extends Server {
	constructor(handler) {
		super();
		this.server = HTTP.createServer();
		this.server.on("request", handler);
	}

	start() {
		super.start();
		
		this.server.listen(app.globalConfig.get("server.port"));
	}

	stop() {
		super.stop();
	}
}
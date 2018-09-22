let Server = require("./server");
let HTTP = require("http");

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
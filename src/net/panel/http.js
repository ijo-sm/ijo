let Server = require("./server");
let HTTP = require("http");

module.exports = class HTTPServer extends Server {
	constructor(config, handler) {
		super();

		this.config = config;
		this.server = HTTP.createServer();
		this.server.on("request", handler);
	}

	start() {
		super.start();
		
		this.server.listen(this.config.get("server.port"));
	}

	stop() {
		super.stop();
	}
}
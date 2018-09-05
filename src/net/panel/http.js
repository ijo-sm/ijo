var Server = require("./server");
var http = require("http");

module.exports = class HTTPServer extends Server {
	constructor(settings, handler) {
		super();

		this.settings = settings;
		this.server = http.createServer();
		this.server.on("request", handler);
	}

	start() {
		super.start();
		this.server.listen(this.settings.port);
	}

	stop() {
		super.stop();
	}
}
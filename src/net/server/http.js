const http = require("http");
const pify = require("pify");
const AbstractServer = require("./abstract");

module.exports = class HTTPServer extends AbstractServer {
	constructor(handler) {
		super();
		
		this.server = http.createServer();
		this.server.on("request", handler);
		this.port = 80;
	}

	async start() {
		super.start();

		await pify(this.server.listen.bind(this.server))(this.port);
	}

	stop() {
		super.stop();
	}
}
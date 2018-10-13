const AbstractServer = require("./abstract");
const HTTP = require("http");
const pify = require("pify");

module.exports = class HTTPServer extends AbstractServer {
	constructor(handler) {
		super();
		this.server = HTTP.createServer();
		this.server.on("request", handler);
	}

	async start() {
		super.start();

		await pify(this.server.listen.bind(this.server))(app.globalConfig.get("server.port"));
	}

	stop() {
		super.stop();
	}
}
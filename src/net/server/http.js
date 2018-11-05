const HTTP = include("http");
const NodeUtils = include("util");
const AbstractServer = include("src/net/server/abstract");

module.exports = class HTTPServer extends AbstractServer {
	constructor(handler) {
		super();
		
		this.server = HTTP.createServer();
		this.server.on("request", handler);
		this.port = 80;
	}

	async start() {
		super.start();

		await NodeUtils.promisify(this.server.listen.bind(this.server))(this.port);
	}

	stop() {
		super.stop();
	}
}
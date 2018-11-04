const net = require("net");
const NodeUtils = require("util");
const AbstractServer = require("./abstract");

module.exports = class TCPServer extends AbstractServer {
	constructor(handler) {
		super();
		
		this.server = net.createServer();
		this.server.on("connection", handler);
		this.port = 71;
	}

	async start() {
		super.start();

		await NodeUtils.promisify(this.server.listen.bind(this.server))(this.port);
	}

	stop() {
		super.stop();
	}
}
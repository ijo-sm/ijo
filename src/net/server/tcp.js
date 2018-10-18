const net = require("net");
const pify = require("pify");
const AbstractServer = require("./abstract");

module.exports = class TCPServer extends AbstractServer {
	constructor(handler) {
		super();
		
		this.server = net.createServer();
		this.server.on("connection", handler);
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
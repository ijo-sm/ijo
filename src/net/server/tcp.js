const Net = include("net");
const NodeUtils = include("util");
const AbstractServer = include("src/net/server/abstract");

module.exports = class TCPServer extends AbstractServer {
	constructor(handler) {
		super();
		
		this.server = Net.createServer();
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
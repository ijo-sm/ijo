const TCPServer = require("./../server/tcp");

module.exports = class MachineServer {
	start() {
		this.server = new TCPServer(this.handle.bind(this));
		this.server.port = 4944;

		return this.server.start();
	}

	handle(socket) {

	}
}
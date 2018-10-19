const TCPServer = require("./../server/tcp");

module.exports = class MachineServer {
	constructor() {
		this.packetHandler = new PacketHandler();
	}

	start() {
		this.server = new TCPServer(this.handle.bind(this));
		this.server.port = 4944;

		return this.server.start();
	}

	stop() {}

	}

	handle(socket) {
		app.machines.handleMachine(socket);
	}
}
const TCPServer = require("./../server/tcp");
const PacketHandler = require("./handler");
const AuthenticationPackets = require("./packets/auth");
const UserPackets = require("./packets/user");

module.exports = class MachineServer {
	constructor() {
		this.packetHandler = new PacketHandler();

		let packetLists = [
			new AuthenticationPackets(),
			new UserPackets()
		];
		
		for(let packetList of packetLists) {
			packetList.init(this.packetHandler);
		}
	}

	start() {
		this.server = new TCPServer(this.handle.bind(this));
		this.server.port = app.globalConfig.get("machineServer.port");
		
		return this.server.start();
	}

	stop() {

	}

	handle(socket) {
		app.machines.handleMachine(socket);
	}
}
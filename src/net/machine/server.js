const TCPServer = require("./../server/tcp");
const PacketHandler = require("./handler");
const UserPackets = require("./packets/user");
const MachinePackets = require("./packets/machine");

module.exports = class MachineServer {
	constructor() {
		this.packetHandler = new PacketHandler();

		let packetLists = [
			new UserPackets(),
			new MachinePackets()
		];
		
		for(let packetList of packetLists) {
			packetList.init(this.packetHandler);
		}
	}

	start() {
		this.server = new TCPServer(this.handle.bind(this));
		this.server.port = ijo.globalConfig.get("machineServer.port");
		
		return this.server.start();
	}

	stop() {

	}

	handle(socket) {
		ijo.machines.handle(socket);
	}
}
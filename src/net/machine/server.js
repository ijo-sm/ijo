const TCPServer = include("src/net/server/tcp");
const PacketHandler = include("src/net/machine/handler");
const userPackets = include("src/net/machine/packets/user");
const machinePackets = include("src/net/machine/packets/machine");
const globalConfig = include("src/config/global");
const machineManager = include("src/machine/manager");

class MachineServer {
	constructor() {
		this.packetHandler = new PacketHandler();

		let packetLists = [userPackets, machinePackets];
		
		for(let packetList of packetLists) {
			packetList.init(this.packetHandler);
		}
	}

	start() {
		this.server = new TCPServer(this.handle.bind(this));
		this.server.port = globalConfig.get("machineServer.port");
		
		return this.server.start();
	}

	stop() {
		return this.server.stop();
	}

	handle(socket) {
		machineManager.handleConnection(socket);
	}
}

module.exports = new MachineServer();
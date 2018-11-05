const PacketList = include("src/net/machine/packets/model");
const Packet = include("src/net/machine/packet");

class UserPacketList extends PacketList {
	init(handler) {
		super.init(handler);

		handler.addPacket(new Packet("user/create", "authenticating", this.create));
	}

	create() {
		
	}
}

module.exports =  new UserPacketList();
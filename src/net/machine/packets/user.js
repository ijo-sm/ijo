const PacketList = require("./model");
const Packet = require("./../packet");

module.exports = class UserPacketList extends PacketList {
	init(handler) {
		super.init(handler);

		handler.addPacket(new Packet("user/create", "authenticating", this.create));
	}

	create() {
		
	}
}
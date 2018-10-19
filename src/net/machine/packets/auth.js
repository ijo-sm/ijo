const PacketList = require("./model");
const Packet = require("./../packet");

module.exports = class AuthenticationPacketList extends PacketList {
	init(handler) {
		super.init(handler);

		handler.addPacket(new Packet("auth/auth", "authenticating", this.auth));
	}

	auth() {
		console.log("Machine trying to authenticate");
	}
}
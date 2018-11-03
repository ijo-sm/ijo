const assert = require("assert");
const PacketList = require("./model");
const Packet = require("./../packet");

module.exports = class MachinePacketList extends PacketList {
	init(handler) {
		super.init(handler);

		handler.addPacket(new Packet("machine/create", "authenticating", this.create));
		handler.addPacket(new Packet("machine/auth", "authenticating", this.auth));
	}

	async create(packet, machine) {
		let secret = ijo.utils.crypto.generateSecret();

		machine.load(await ijo.machines.create(secret));
		machine.send("machine/created", {id: machine.id, secret: secret});
	}

	auth(packet, machine) {
		assert(packet.id, "The value id of the received packet is undefined");
		assert(packet.secret, "The value secret of the received packet is undefined");

		machine.load(ijo.machines.get("id", packet.id));

		if(!machine.checkSecret(packet.secret)) {
			machine.disconnect("The id and secret didn't match");
		}

		machine.send("machine/authed");
	}
}
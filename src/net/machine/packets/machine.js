const PacketList = include("src/net/machine/packets/model");
const Packet = include("src/net/machine/packet");
const Assert = include("assert");
const Utils = include("@ijo-sm/utils");
const machineManager = include("src/machine/manager");

class MachinePacketList extends PacketList {
	init(handler) {
		super.init(handler);

		handler.addPacket(new Packet("machine/create", "authenticating", this.create));
		handler.addPacket(new Packet("machine/auth", "authenticating", this.auth));
	}

	async create(packet, machine) {
		let secret = Utils.crypto.generateSecret();

		machine.load(await machineManager.create(secret));
		machine.send("machine/created", {id: machine.id, secret: secret});
	}

	auth(packet, machine) {
		Assert(packet.id, "The value id of the received packet is undefined");
		Assert(packet.secret, "The value secret of the received packet is undefined");

		machine.load(machineManager.get("id", packet.id));

		if(!machine.checkSecret(packet.secret)) {
			machine.disconnect("The id and secret didn't match");
		}

		machine.send("machine/authed");
	}
}

module.exports = new MachinePacketList();
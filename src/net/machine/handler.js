module.exports = class PacketHandler {
	constructor() {
		this.packets = new Map();
	}

	addPacket(packet) {
		this.packets.set(packet.event, packet);
	}

	removePacket(event) {
		this.packets.delete(event);
	}

	hasPacket(packet) {
		return this.packets.has(packet._event)
	}

	async handle(data, machine) {
		let parsedPacket = this._parsePacket(data);

		if(!this.hasPacket(parsedPacket)) {
			return;
		}

		let packet = this.packets.get(parsedPacket._event);

		if(!machine.matchState(packet.state)) {
			return;
		}
		
		await packet.handle(parsedPacket, machine);
	}

	_parsePacket(packet) {
		try {
			return JSON.parse(packet.toString());
		}
		catch(e) {
			throw e;
		}
	}
}
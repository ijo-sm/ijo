module.exports = class Packet {
	constructor(event, state, callback) {
		this.event = event;
		this.state = state;
		this.callback = callback;
	}

	handle(packet, machine) {
		this.callback(packet, machine);
	}
}
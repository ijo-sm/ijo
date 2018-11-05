module.exports = class Packet {
	constructor(event, state, callback) {
		this.event = event;
		this.state = state;
		this.callback = callback;
	}

	async handle(packet, machine) {
		await this.callback(packet, machine);
	}
}
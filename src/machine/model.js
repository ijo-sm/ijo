module.exports = class Machine {
	constructor(socket) {
		this.socket = socket;
		this.state = "authenticating";

		this.socket.on("data", packet => {
			app.machineServer.packetHandler.handle(packet, this);
		});

		this.socket.on("end", () => {
			this.disconnect();
		});
	}

	send(event, data = {}) {
		data.event = event;

		this.socket.write(JSON.stringify(data));
	}

	disconnect() {

	}
}
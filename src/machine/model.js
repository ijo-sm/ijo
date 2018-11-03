module.exports = class Machine {
	constructor(socket) {
		this.socket = socket;
		this.state = "authenticating";

		this.socket.on("data", packet => {
			ijo.machineServer.packetHandler.handle(packet, this);
		});

		this.socket.on("end", () => {
			this.disconnect();
		});
	}

	load(data = {}) {
		this.id = data.id;
		this.secret = data.secret;
	}

	send(event, data = {}) {
		data._event = event;

		this.socket.write(JSON.stringify(data));
	}

	checkSecret(secret) {
		return this.secret === ijo.utils.crypto.hash(secret);
	}

	matchState(state) {
		return this.state === state;
	}

	disconnect(reason) {
		this.socket.end(reason);
	}
}
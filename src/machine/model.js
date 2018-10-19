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

	load(data = {}) {
		this.id = data.id;
		this.secret = data.secret;
	}

	send(event, data = {}) {
		data._event = event;

		this.socket.write(JSON.stringify(data));
	}

	checkSecret(secret) {
		return this.secret === Utils.crypto.hash(secret);
	}

	disconnect(reason) {
		this.socket.end(reason);
	}
}
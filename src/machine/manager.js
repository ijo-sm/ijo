const Machine = require("./model");

module.exports = class MachineManager {
	constructor() {
		this.connected = [];
	}

	async create(secret) {
		let id = Utils.generate.shortid();
		let hashedSecret = Utils.crypto.hash(secret);

		await app.db.get("machines").push({
			id, secret: hashedSecret
		}).write();

		return this.get("id", id);
	}

	initialize() {
		app.db.create("machines");
	}

	handle(socket) {
		this.connected.push(new Machine(socket));
	}

	get(key, value) {
		return app.db.get("machines").find(machine => machine[key] === value).value();
	}
}
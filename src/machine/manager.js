const Machine = require("./model");

module.exports = class MachineManager {
	constructor() {
		this.connectedMachines = [];
	}
	
	initialize() {
		app.db.create("machines");
	}

	async create(secret) {
		let id = Utils.generate.shortid();
		let hashedSecret = Utils.crypto.hash(secret);

		await app.db.get("machines").push({
			id, secret: hashedSecret
		}).write();

		return this.get("id", id);
	}

	handle(socket) {
		this.connectedMachines.push(new Machine(socket));
	}

	connected(key, value) {
		return this.connectedMachines.find(machine => machine[key] === value);
	}

	get(key, value) {
		return app.db.get("machines").find(machine => machine[key] === value).value();
	}
}
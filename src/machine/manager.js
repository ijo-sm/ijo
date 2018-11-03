const Machine = require("./model");

module.exports = class MachineManager {
	constructor() {
		this.connectedMachines = [];
	}
	
	initialize() {
		ijo.db.create("machines");
	}

	async create(secret) {
		let id = ijo.utils.generate.shortid();
		let hashedSecret = ijo.utils.crypto.hash(secret);

		await ijo.db.get("machines").push({
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
		return ijo.db.get("machines").find(machine => machine[key] === value).value();
	}
}
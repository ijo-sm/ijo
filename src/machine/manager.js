const Machine = include("src/machine/model");
const Utils = include("@ijo-sm/utils");
const database = include("src/database/database");

class MachineManager {
	constructor() {
		this.connectedMachines = [];
	}
	
	initialize() {
		database.create("machines");
	}

	async create(secret) {
		let id = Utils.generate.shortid();
		let hashedSecret = Utils.crypto.hash(secret);

		await database.get("machines").push({
			id, secret: hashedSecret
		}).write();

		return this.get("id", id);
	}

	handleConnection(socket) {
		this.connectedMachines.push(new Machine(socket));
	}

	connected(key, value) {
		return this.connectedMachines.find(machine => machine[key] === value);
	}

	get(key, value) {
		return database.get("machines").find(machine => machine[key] === value).value();
	}
}

module.exports = new MachineManager();
const Machine = require("./model");

module.exports = class MachineManager {
	constructor() {
		this.connected = [];
	}

	initialize() {
		app.db.create("machines");
	}

	handleMachine(socket) {
		this.connected.push(new Machine(socket));
	}
}
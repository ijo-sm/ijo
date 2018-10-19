const Machine = require("./model");

module.exports = class MachineManager {
	constructor() {
		this.connected = [];
	}

	initialize() {
		app.db.create("machines");
	}

	handle(socket) {
		this.connected.push(new Machine(socket));
	}
}
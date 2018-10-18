module.exports = class MachineManager {
	initialize() {
		app.db.create("machines");
	}
}
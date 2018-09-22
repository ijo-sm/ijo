let low = require("lowdb");
let FileAsync = require("lowdb/adapters/FileAsync");
let Path = require("path");

module.exports = class DatabaseManager {
	constructor() {}

	async load() {
		this.users = await low(new FileAsync(Path.resolve(__dirname, "../../data/users.json")));
	}
}
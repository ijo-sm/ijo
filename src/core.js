const path = require("path");
const JSONDatabase = require("./database/json");
const DatabaseTypes = require("./database/types");
const Api = require("./net/api");
const ConfigFile = require("./utils/configFile");

class Core {
	constructor() {
		this.api = new Api();
		this.configs = {
			main: new ConfigFile(path.join(this.root, "./config.json"), {defaults: {api: {port: 8080}, database: {type: "json", path: "./data/"}}})
		};
		this.databaseTypes = new DatabaseTypes();
		this.databaseTypes.register("json", JSONDatabase);
	}

	// TODO: Root will be inaccurate if ijo is not started using npm start.
	get root() {
		return process.cwd();
	}

	async initialize() {
		await this.configs.main.load();
		this.api.initialize();
		this.database = this.getDatabase();
	}

	getDatabase() {
		const databaseConfig = this.configs.main.get("database");

		if(databaseConfig === undefined) throw Error("There is no configuration for the database.");

		const databaseClass = this.databaseTypes.getDatabaseClass(databaseConfig.type);

		if(databaseClass === undefined) throw Error("Database type specified in config doesn't exist.");

		return new (databaseClass)(databaseConfig, {root: this.root});
	}

	async start() {
		await this.database.connect();
		await this.api.startServer({port: this.configs.main.get("api").port});
	}

	async stop() {
		await this.api.closeServer();
		await this.database.close();
	}
}

module.exports = Core;
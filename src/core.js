const path = require("path");
const JSONDatabase = require("./database/jsonDatabase");
const DatabaseTypes = require("./database/types");
const Api = require("./net/api");
const PluginManager = require("./plugin/pluginManager");
const ConfigFile = require("./utils/configFile");

class Core {
	constructor() {
		this.api = new Api();
		this.config = new ConfigFile(path.join(this.root, "./config.json"), {defaults: {
			api: {port: 8080},
			database: {type: "json", path: "./data/"},
			plugins: {path: "./plugins/"}
		}});
		this.databaseTypes = new DatabaseTypes();
		this.databaseTypes.register("json", JSONDatabase);
		this.pluginManager = new PluginManager();
	}

	// TODO: Root will be inaccurate if ijo is not started using npm start.
	get root() {
		return process.cwd();
	}

	async initialize() {
		await this.config.load();
		this.api.initialize();
		await this.pluginManager.load(this.config.get("plugins"), {root: this.root});
		this.database = this.databaseTypes.getDatabase(this.config.get("database"), {root: this.root});
	}

	async start() {
		await this.database.connect();
		await this.api.startServer({port: this.config.get("api").port});
	}

	async stop() {
		await this.api.closeServer();
		await this.database.close();
	}
}

module.exports = Core;
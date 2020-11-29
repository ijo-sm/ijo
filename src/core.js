const path = require("path");
const JSONDatabase = require("./database/jsonDatabase");
const DatabaseTypes = require("./database/types");
const Api = require("./net/api");
const PluginManager = require("./plugin/pluginManager");
const ConfigFile = require("./utils/configFile");

/**
 * This core class manages all the subsystems for IJO.
 */
class Core {
	/**
	 * On creation the instances of the static, meaning independent of user input, subsytems are created and added to 
	 * the core. For some subsystem static parameters are also supplied.
	 */
	constructor() {
		this.api = new Api();
		this.config = new ConfigFile(path.join(this.root, "./config.json"), {defaults: {
			api: {port: 8080},
			database: {type: "json", path: "./data/"},
			plugins: {path: "./plugins/"}
		}});
		this.databaseTypes = new DatabaseTypes();
		this.pluginManager = new PluginManager();
	}

	get root() {
		return path.join(path.dirname(require.main.filename), "../");
	}
	
	/**
	 * Initializes all subsystems for IJO.
	 */
	async initialize() {
		await this.config.load();
		this.api.initialize();
		await this.pluginManager.load(this.config.get("plugins"), {root: this.root});
		this.databaseTypes.register("json", JSONDatabase);
		this.database = this.databaseTypes.getDatabase(this.config.get("database"), {root: this.root});
	}

	/**
	 * Starts IJO.
	 */
	async start() {
		await this.database.load();
		await this.api.startServer({port: this.config.get("api").port});
	}

	/**
	 * Stops IJO.
	 */
	async stop() {
		await this.api.closeServer();
		await this.database.close();
	}
}

module.exports = Core;

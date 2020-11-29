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

	/**
	 * Returns the root for IJO.
	 * @returns {String} The root for IJO.
	 */
	get root() {
		return path.join(path.dirname(require.main.filename), "../");
	}
	
	/**
	 * Initializes all subsystems for IJO.
	 * @returns {Promise} A promise that resolves after initialization.
	 */
	async initialize() {
		await this.config.load().catch(e => {throw e});
		this.api.initialize();
		await this.pluginManager.initialize(this.config.get("plugins"), {root: this.root}, this).catch(e => {throw e});
		this.databaseTypes.register("json", JSONDatabase);
		this.database = this.databaseTypes.getDatabase(this.config.get("database"), {root: this.root});
	}

	/**
	 * Starts IJO.
	 * @returns {Promise} A promise that resolves when IJO has started.
	 */
	async start() {
		await this.database.load().catch(e => {throw e});
		await this.api.startServer({port: this.config.get("api").port}).catch(e => {throw e});
		await this.pluginManager.enable();
	}

	/**
	 * Stops IJO.
	 * @returns {Promise} A promise that resolves when IJO has stopped.
	 */
	async stop() {
		await this.pluginManager.disable();
		await this.api.closeServer().catch(e => {throw e});
		await this.database.close().catch(e => {throw e});
		await this.pluginManager.unload();
	}
}

module.exports = Core;

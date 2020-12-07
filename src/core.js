const path = require("path");
const JSONDatabase = require("./database/jsonDatabase");
const DatabaseTypes = require("./database/types");
const ApiServer = require("./net/apiServer");
const DaemonServer = require("./net/daemonServer");
const PluginManager = require("./plugin/pluginManager");
const Users = require("./user/users");
const {ConfigFile} = require("ijo-utils");
const Daemons = require("./daemon/daemons");

/**
 * This core class manages all the subsystems for IJO.
 */
class Core {
	/**
	 * On creation the instances of the static, meaning independent of user input, subsytems are created and added to 
	 * the core. For some subsystem static parameters are also supplied.
	 */
	constructor() {
		this.apiServer = new ApiServer();
		this.daemonServer = new DaemonServer();
		this.config = new ConfigFile(path.join(this.root, "./config.json"), {defaults: {
			api: {port: 8080},
			daemon: {port: 8081},
			database: {type: "json", path: "./data/"},
			plugins: {path: "./plugins/"}
		}});
		this.databaseTypes = new DatabaseTypes();
		this.pluginManager = new PluginManager();
		this.users = new Users();
		this.daemons = new Daemons();
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
		this.apiServer.initialize();
		this.daemonServer.initialize({daemons: this.daemons});
		await this.pluginManager.initialize(this.config.get("plugins"), {root: this.root}, this).catch(e => {throw e});
		this.databaseTypes.register("json", JSONDatabase);
		this.database = this.databaseTypes.getDatabase(this.config.get("database"), {root: this.root});
		this.users.initialize({database: this.database, apiServer: this.apiServer});
		this.daemons.initialize({database: this.database, daemonServer: this.daemonServer, apiServer: this.apiServer});
	}

	/**
	 * Starts IJO.
	 * @returns {Promise} A promise that resolves when IJO has started.
	 */
	async start() {
		await this.database.load().catch(e => {throw e});
		this.users.load({database: this.database});
		this.daemons.load({database: this.database});
		await this.daemonServer.start({port: this.config.get("daemon").port}).catch(e => {throw e});
		await this.apiServer.start({port: this.config.get("api").port}).catch(e => {throw e});
		await this.pluginManager.enable().catch(e => {throw e});
	}

	/**
	 * Stops IJO.
	 * @returns {Promise} A promise that resolves when IJO has stopped.
	 */
	async stop() {
		await this.pluginManager.disable().catch(e => {throw e});
		await this.apiServer.close().catch(e => {throw e});
		await this.daemonServer.close().catch(e => {throw e});
		await this.database.close().catch(e => {throw e});
		await this.pluginManager.unload().catch(e => {throw e});
		await this.config.save().catch(e => {throw e});
	}
}

module.exports = Core;

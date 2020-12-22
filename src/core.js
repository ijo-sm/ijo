const path = require("path");
const {Logger, ConfigFile, ApiServer} = require("ijo-utils");
const JSONDatabase = require("./database/json/database");
const DatabaseTypes = require("./database/types");
const DaemonServer = require("./net/daemon/server");
const Plugins = require("./plugin/manager");
const Users = require("./user/manager");
const Daemons = require("./daemon/manager");
const {nanoid} = require("nanoid");

/**
 * This core class manages all the subsystems for IJO.
 */
class Core {
    /**
     * On creation the instances of the static, meaning independent of user input, subsytems are created and added to 
     * the core. For some subsystem static parameters are also supplied.
     */
    constructor() {
        // TODO: Add control over log level using cli args
        /** The core log
         * @type {Logger} */
        this.log = new Logger();
        /** The api server.
         * @type {ApiServer} */
        this.apiServer = new ApiServer();
        /** The daemon server.
         * @type {DaemonServer} */
        this.daemonServer = new DaemonServer();
        /** The database types.
         * @type {DatabaseTypes} */
        this.databaseTypes = new DatabaseTypes();
        /** The plugin manager.
         * @type {Plugins} */
        this.plugins = new Plugins();
        /** The users manager.
         * @type {Users} */
        this.users = new Users();
        /** The daemon manager.
         * @type {Daemons} */
        this.daemons = new Daemons();
        /** The main configuration file.
         * @type {ConfigFile} */
        this.config = new ConfigFile(path.join(this.root, "./config.json"), {defaults: {
            api: {port: 8080, auth: {secret: nanoid(32), expiresIn: "5d"}},
            daemon: {port: 8081},
            database: {type: "json", path: "./data/"},
            plugins: {path: "./plugins/"}
        }});
    }

    /**
     * Returns the root for IJO.
     * @type {String}
     */
    get root() {
        return path.join(path.dirname(require.main.filename), "../");
    }
    
    /**
     * Initializes all subsystems for IJO.
     * @returns {Promise} A promise that resolves after initialization.
     */
    async initialize() {
        await this.log.initialize({folder: path.join(this.root, "./logs"), name: "core", logLevel: 2});
        await this.config.load().catch(e => {throw e});
        this.apiServer.initialize();
        this.daemonServer.initialize({daemons: this.daemons});
        await this.plugins.initialize(this.config.get("plugins"), {root: this.root}, this).catch(e => {throw e});
        this.databaseTypes.register("json", JSONDatabase);
        this.database = this.databaseTypes.getDatabase(this.config.get("database"), {root: this.root});
        this.users.initialize({
            database: this.database, 
            apiServer: this.apiServer
        }, {auth: this.config.get("api").auth});
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
        await this.plugins.enable().catch(e => {throw e});
        this.log.info("IJO's core has started");
    }

    /**
     * Stops IJO.
     * @param {string} event The event that caused IJO to stop.
     * @returns {Promise} A promise that resolves when IJO has stopped.
     */
    async stop(event) {
        await this.plugins.disable().catch(e => {throw e});
        await this.apiServer.close().catch(e => {throw e});
        await this.daemonServer.close().catch(e => {throw e});
        await this.database.close().catch(e => {throw e});
        await this.plugins.unload().catch(e => {throw e});
        await this.config.save().catch(e => {throw e});
        this.log.info(`IJO's core has stopped (event: ${event})`);
        await this.log.close();
    }
}

module.exports = Core;

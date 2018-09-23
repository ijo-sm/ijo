const Server = require("./net/panel/server");
const GlobalConfigFile = require("./config/global");
const DefaultRoutes = require("./net/panel/default");
const Database = require("./db/database");
const UserManager = require("./user/manager");
const PluginManager = require("./plugin/manager");

module.exports = class Application {
	constructor() {
		this.listening = false;
		this.server = new ServerManager();
		this.globalConfigManager = new GlobalConfigManager();
		this.db = new DatabaseManager();
		this.userManager = new UserManager();
	}

	async start() {
		await this.db.load();
		await this.db.defaults();

		this.userManager.create("admin", "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918");

		this.globalConfig = await this.globalConfigManager.load();

		this.defaultRoutes = new DefaultRoutes();

		await this.defaultRoutes.init();
		
		this.server.start();

		this.listening = true;
	}

	async stop() {
		await this.globalConfigManager.save(this.globalConfig);
		
		this.listening = false;
	}
}
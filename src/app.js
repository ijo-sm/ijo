const SiteServer = require("./net/site/server");
const MachineServer = require("./net/machine/server");
const GlobalConfigFile = require("./config/global");
const DefaultRoutes = require("./net/site/default");
const Database = require("./db/database");
const UserManager = require("./user/manager");
const PluginManager = require("./plugin/manager");

module.exports = class Application {
	constructor() {
		this.siteServer = new SiteServer();
		this.machineServer = new MachineServer();
		this.db = new Database();
		this.users = new UserManager();
		this.plugins = new PluginManager();
		this.globalConfig = new GlobalConfigFile();
		this.defaultRoutes = new DefaultRoutes();

		this.db.create("users");

		this.listening = false;
	}

	async start() {
		await this.db.load();
		await this.plugins.load();
		await this.users.create("admin", "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918");
		await this.globalConfig.load();
		await this.defaultRoutes.init();
		await this.machineServer.start();
		await this.siteServer.start();

		this.listening = true;
	}

	async stop() {
		await this.machineServer.stop();
		await this.siteServer.stop();
		await this.globalConfig.save();
		
		this.listening = false;
	}
}
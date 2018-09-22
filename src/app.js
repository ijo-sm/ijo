let ServerManager = require("./net/panel/manager");
let Route = require("./net/panel/route");
let GlobalConfigManager = require("./config/global");
let DefaultRoutes = require("./net/panel/default");
let DatabaseManager = require("./db/manager");

module.exports = class Application {
	constructor() {
		this.listening = false;
		this.serverManager = new ServerManager();
		this.globalConfigManager = new GlobalConfigManager();
		this.db = new DatabaseManager();
	}

	async start() {
		await this.db.load();
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
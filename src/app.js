let ServerManager = require("./net/panel/manager");
let Route = require("./net/panel/route");
let GlobalConfigManager = require("./config/global");
let DefaultRoutes = require("./net/panel/default");
let DatabaseManager = require("./db/manager");
let UserManager = require("./user/manager");

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

		this.userManager.create("admin", "8C6976E5B5410415BDE908BD4DEE15DFB167A9C873FC4BB8A81F6F2AB448A918");

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
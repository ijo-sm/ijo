let ServerManager = require("./net/panel/manager");
let Route = require("./net/panel/route");
let GlobalConfigManager = require("./config/global");
let DefaultRoutes = require("./net/panel/default");

module.exports = class Application {
	constructor() {
		this.listening = false;
		this.serverManager = new ServerManager();
		this.globalConfigManager = new GlobalConfigManager();
	}

	async start() {
		this.globalConfig = await this.globalConfigManager.load();

		this.defaultRoutes = new DefaultRoutes(this.serverManager);

		await this.defaultRoutes.init();
		
		this.serverManager.start(this.globalConfig);

		this.listening = true;
	}

	async stop() {
		await this.globalConfigManager.save(this.globalConfig);
		
		this.listening = false;
	}
}
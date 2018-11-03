const SiteServer = require("./net/site/server");
const MachineServer = require("./net/machine/server");
const GlobalConfigFile = require("./config/global");
const DefaultRoutes = require("./net/site/default");
const Database = require("@ijo-sm/helper-database");
const UserManager = require("./user/manager");
const MachineManager = require("./machine/manager");
const PluginManager = require("./plugin/manager");
const UtilsManager = require("@ijo-sm/utils");

module.exports = class Application {
	constructor() {
		this.utils = new UtilsManager();
		
		this.utils.use("process", require("@ijo-sm/utils-process"));
		this.utils.use("path", require("@ijo-sm/utils-path"));
		this.utils.use("array", require("@ijo-sm/utils-array"));
		this.utils.use("crypto", require("@ijo-sm/utils-crypto"));
		this.utils.use("generate", require("@ijo-sm/utils-generate"));
		this.utils.use("platform", require("@ijo-sm/utils-platform"));
		
		this.siteServer = new SiteServer();
		this.machineServer = new MachineServer();
		this.db = new Database(this.utils.path.resolve("../data/panel.json"));
		this.users = new UserManager();
		this.machines = new MachineManager();
		this.plugins = new PluginManager();
		this.globalConfig = new GlobalConfigFile();
		this.defaultRoutes = new DefaultRoutes();

		this.listening = false;
	}

	async start() {
		this.users.initialize();
		this.machines.initialize();

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
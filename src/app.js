const siteServer = include("src/net/site/server");
const machineServer = include("src/net/machine/server");
const globalConfig = include("src/config/global");
const defaultRoutes = include("src/net/site/default");
const database = include("src/database/database");
const userManager = include("src/user/manager");
const machineManager = include("src/machine/manager");
const pluginManager = include("src/plugin/manager");

module.exports = class Application {
	constructor() {
		this.listening = false;
	}

	async start() {
		userManager.initialize();
		machineManager.initialize();

		await database.load();
		await pluginManager.load();
		await userManager.create("admin", "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918");
		await globalConfig.load();
		await defaultRoutes.init();
		await machineServer.start();
		await siteServer.start();
		await pluginManager.enable();

		this.listening = true;
	}

	async stop() {
		await pluginManager.disable();
		await machineServer.stop();
		await siteServer.stop();
		await globalConfig.save();
		await pluginManager.unload();
		
		this.listening = false;
	}
}
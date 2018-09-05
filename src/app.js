module.exports = class Application {
	constructor() {
		this.listening = false;
		this.serverManager = new (require("./net/panel/manager"))();
		this.globalSettingsManager = new (require("./global/settings"))();
	}

	async start() {
		this.globalSettings = await this.globalSettingsManager.load();
		this.serverManager.start(this.globalSettings.server);
		this.listening = true;
	}

	async stop() {
		await this.globalSettingsManager.save(this.globalSettings);
		this.listening = false;
	}
}
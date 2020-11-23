const path = require("path");
const ConfigFile = require("./utils/configFile");

class Core {
	constructor() {
		this.configs = {
			main: new ConfigFile(path.join(this.root, "./config.json"), {defaults: {api: {port: 8080}}})
		};
	}

	// TODO: Root will be inaccurate if ijo is not started using npm start.
	get root() {
		return process.cwd();
	}

	async initialize() {
		await this.configs.main.load();
	}

	start() {
	}

	async stop() {
	}
}

module.exports = Core;
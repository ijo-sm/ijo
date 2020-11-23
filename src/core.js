const path = require("path");
const Api = require("./net/api");
const ConfigFile = require("./utils/configFile");

class Core {
	constructor() {
		this.api = new Api();
		this.configs = {
			main: new ConfigFile(path.join(this.root, "./config.json"), {defaults: {api: {port: 8080}}})
		};
	}

	// TODO: Root will be inaccurate if ijo is not started using npm start.
	get root() {
		return process.cwd();
	}

	async initialize() {
		this.api.initialize();
		await this.configs.main.load();
	}

	start() {
		return this.api.startServer({port: this.configs.main.get("api").port});
	}

	async stop() {
		await this.api.closeServer();
	}
}

module.exports = Core;
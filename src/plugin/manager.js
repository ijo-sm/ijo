const FileSystem = include("fs");
const NodeUtils = include("util");
const Plugin = include("src/plugin/model");
const Utils = include("@ijo-sm/utils");

class PluginManager {
	constructor() {
		this.plugins = new Map();
	}

	async load() {
		let paths = await NodeUtils.promisify(FileSystem.readdir)(Utils.path.resolve("plugins/"));

		paths.forEach(this._loadPlugin.bind(this));
	}

	async _loadPlugin(path) {
		let plugin;

		try {
			plugin = new Plugin(require(Utils.path.resolve(`plugins/${path}/plugin.json`)));
		} catch(e) {
			return console.error(`The plugin at /panel/plugins/${path} could not be loaded: ${e.message}`);
		}
		
		if(this.plugins.has(plugin.name)) {
			return console.error(`The plugin ${plugin.name} has already been loaded`);
		}

		await plugin.loadIndexFile();
		await plugin.executeEvent("load");

		this.plugins.set(plugin.name, plugin);
	}

	enable(name) {
		return this._executeEvent(name, "enable");
	}

	disable(name) {
		return this._executeEvent(name, "disable");
	}

	unload(name) {
		return this._executeEvent(name, "unload");
	}

	_executeEvent(name, event) {
		if(typeof name !== "string") {
			return this._executeGlobalEvent(event);
		}

		return this.plugins.get(name).executeEvent(event);
	}

	async _executeGlobalEvent(event) {
		this.plugins.forEach(async plugin => {
			await plugin.executeEvent(event);
		});
	}
}

module.exports = new PluginManager();
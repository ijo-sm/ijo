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

		paths.forEach(async (path) => {
			let plugin;

			try {
				plugin = new Plugin(require(Utils.path.resolve(`plugins/${path}/plugin.json`)));
			} catch(e) {
				return console.error(`The plugin at /panel/plugins/${path} could not be loaded: ${e.message}`);
			}
			
			if(this.plugins.has(plugin.name)) {
				return console.error(`The plugin ${plugin.name} has already been loaded`);
			}

			await plugin.load();

			this.plugins.set(plugin.name, plugin);
		});
	}

	async enable() {
		this.plugins.forEach(plugin => {
			plugin.executeEvent("enable");
		});
	}

	async disable() {
		this.plugins.forEach(plugin => {
			plugin.executeEvent("disable");
		});
	}

	async unload() {
		this.plugins.forEach(plugin => {
			plugin.executeEvent("unload");
		});
	}
}

module.exports = new PluginManager();
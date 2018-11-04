const FileSystem = require("fs");
const NodeUtils = require("util");
const Plugin = require("./model");


module.exports = class PluginManager {
	constructor() {
		this.plugins = new Map();
	}

	async load() {
		let paths = await NodeUtils.promisify(FileSystem.readdir)(ijo.utils.path.resolve("plugins/"));

		paths.forEach(function(path) {
			let plugin 

			try {
				plugin = new Plugin(path);
			} catch(e) {
				return console.error(`The plugin at /panel/plugins/${path} could not be loaded: ${e.message}`);
			}
			
			if(this.plugins.has(plugin.name)) {
				return console.error(`The plugin ${plugin.name} has already been loaded`);
			}

			plugin.initialize();

			this.plugins.set(plugin.name, plugin);
		}.bind(this));
	}
}
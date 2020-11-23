const nodePath = require("path");
const ConfigFile = require("../utils/configFile");
const FSUtils = require("../utils/fsUtils");

class PluginManager {
	constructor() {
		this.plugins = [];
	}

	async load({path} = {}, {root} = {}) {
		this.path = nodePath.join(root, path);

		if(!FSUtils.exists(this.path) || !(await FSUtils.isFolder(this.path).catch(err => {throw err}))) {
			await FSUtils.createFolder(this.path).catch(err => {throw err});
		}

		const folders = await FSUtils.readdir(this.path).catch(err => {throw err});

		for(const folder of folders) {
			const pluginPath = nodePath.join(this.path, folder);
			const configPath = nodePath.join(pluginPath, "plugin.json");

			if(!FSUtils.exists(configPath) || !(await FSUtils.isFile(configPath).catch(err => {throw err}))) {
				throw Error(`There is no plugin configuration file for ${configPath}`);
			}

			const config = new ConfigFile(configPath);
			await config.load();

			// TODO: Check plugin correctness

			this.plugins.push({
				name: config.get("name"),
				path: pluginPath
			});
		}
	}
}

module.exports = PluginManager;
const nodePath = require("path");
const ConfigFile = require("../utils/configFile");
const FSUtils = require("../utils/fsUtils");
const Plugin = require("./plugin");

/**
 * This the class managing all plugins added to this instance of IJO.
 */
class PluginManager {
	constructor() {
		this.plugins = [];
	}

	async findPlugins(path) {
		if(!FSUtils.exists(path) || !(await FSUtils.isFolder(path).catch(err => {throw err}))) {
			await FSUtils.createFolder(path).catch(err => {throw err});
		}

		const folders = await FSUtils.readdir(path).catch(err => {throw err});
		const plugins = [];

		for(const folder of folders) {
			const pluginPath = nodePath.join(path, folder);
			const configPath = nodePath.join(pluginPath, "plugin.json");

			if(!FSUtils.exists(configPath) || !(await FSUtils.isFile(configPath).catch(err => {throw err}))) {
				throw Error(`There is no plugin configuration file for ${configPath}`);
			}

			const config = new ConfigFile(configPath);
			await config.load();

			// TODO: Check plugin correctness
			const plugin = new Plugin({
				name: config.get("name"),
				dependencies: config.get("dependencies") || [],
				author: config.get("author"),
				path: pluginPath
			});

			plugins.push(plugin);
		}

		return plugins;
	}

	/**
	 * Finds and loads all plugins in the specified folder, meanwhile checking if the plugin configuration is correct 
	 * and won't cause any trouble. Also some arguments, like the root location, that are not from the user's 
	 * configuration should be included.
	 */
	async initialize({path} = {}, {root} = {}) {
		this.path = nodePath.join(root, path);

		// Check if folder exists and create it if it doesn't.
		const plugins = await this.findPlugins(this.path).catch(err => {throw err});
		
		// Add the true dependencies, meaning all recursively found children dependencies are included.
		plugins.forEach(plugin => plugin.addTrueDependencies(plugins));

		// Sorts all the plugins depending on which plugins depends on eachother. This enables them to be loaded in the correct order.
		this.plugins.push(...plugins.sort((a, b) => this.compareDependencies(a, b)));

		// TODO: Actually load plugins.
	}

	/**
	 * Compares plugin a with plugin b and returns their respective order as -1, 0 or 1. This order is determined based 
	 * on which plugin depends on which other plugins. Plugins depending on another plugin should of course be loaded 
	 * after the plugin they depend on.
	 */
	compareDependencies(a, b) {
		const aDependencies = a.trueDependencies || [];
		const bDependencies = b.trueDependencies || [];

		if(aDependencies.includes(b.name) && bDependencies.includes(a.name)) {
			throw Error("Two plugins cannot depend on eachother.");
		}

		if(aDependencies.includes(b.name)) return 1;
		else if(bDependencies.includes(a.name)) return -1;
		else return 0;
	}
}

module.exports = PluginManager;
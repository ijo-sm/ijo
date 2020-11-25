const nodePath = require("path");
const ConfigFile = require("../utils/configFile");
const FSUtils = require("../utils/fsUtils");

/**
 * This the class managing all plugins added to this instance of IJO.
 */
class PluginManager {
	constructor() {
		this.plugins = [];
	}

	/**
	 * Finds and loads all plugins in the specified folder, meanwhile checking if the plugin configuration is correct 
	 * and won't cause any trouble. Also some arguments, like the root location, that are not from the user's 
	 * configuration should be included.
	 * TODO: Split up find and load to different methods.
	 */
	async load({path} = {}, {root} = {}) {
		this.path = nodePath.join(root, path);

		// Check if folder exists and create it if it doesn't.
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
				dependencies: config.get("dependencies") || [],
				author: config.get("author"),
				path: pluginPath
			});
		}
		
		// Add the true dependencies, meaning all recursively found children dependencies are included.
		for(const plugin of this.plugins) {
			try {
				plugin.trueDependencies = this.getTrueDependencies(plugin.dependencies);
			}
			catch(err) {
				// If two dependencies depend on eachother this may cause a loop, which is catched using this catch clause.
				// TODO: It may be useful to catch without a clause.
				throw Error(`The plugin ${plugin.name} creates a dependency loop.`);
			}
		}

		// Sorts all the plugins depending on which plugins depends on eachother. This enables them to be loaded in the correct order.
		this.plugins = this.plugins.sort((a, b) => this.compareDependencies(a, b));

		// TODO: Actually load plugins.
	}

	/**
	 * Recursively get the dependencies of the supplied list of dependencies. These "true" dependencies are then 
	 * returned as a flattened array.
	 */
	getTrueDependencies(dependencies) {
		const trueDependencies = [];

		for(const dependency of dependencies) {
			trueDependencies.push(dependency);
			trueDependencies.push(...this.getTrueDependencies(this.plugins.find(plugin => plugin.name === dependency).dependencies));
		}

		return trueDependencies;
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
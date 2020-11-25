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
				dependencies: config.get("dependencies") || [],
				author: config.get("author"),
				path: pluginPath
			});
		}
		
		for(const plugin of this.plugins) {
			try {
				plugin.trueDependencies = this.getTrueDependencies(plugin.dependencies);
			}
			catch(err) {
				throw Error(`The plugin ${plugin.name} creates a dependency loop.`);
			}
		}

		this.plugins = this.plugins.sort((a, b) => this.compareDependencies(a, b));

		console.log(this.plugins);
	}

	getTrueDependencies(dependencies) {
		const trueDependencies = [];

		for(const dependency of dependencies) {
			trueDependencies.push(dependency);
			trueDependencies.push(...this.getTrueDependencies(this.plugins.find(plugin => plugin.name === dependency).dependencies));
		}

		return trueDependencies;
	}

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
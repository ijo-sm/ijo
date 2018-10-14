const FileSystem = require("fs");
const pify = require("pify");
const assert = require("assert");
const {Plugin, PluginEnvironment} = require("./model");

function loadPlugin(path) {
	let plugin = require(app.utils.path.resolve("plugins/" + path + "/plugin.json"));

	plugin.panel = generateEnvironments(plugin.panel);
	plugin.machine = generateEnvironments(plugin.machine);

	validatePlugin(plugin);

	return new Plugin(plugin);
}

function generateEnvironments(environment) {
	if(environment === undefined) {
		return [];
	}
	else if(environment instanceof Array) {
		environment.map(function(environment) {
			validateEnvironment(environment);

			return new PluginEnvironment(environment);
		});
		
		return environment;
	}

	validateEnvironment(environment);

	return [new PluginEnvironment(environment)];
}

function validateEnvironment(environment) {
	assert.equal(typeof environment, "object", "The environment is not an object");
	assert.equal(typeof environment.lang, "string", "There is no language for the environment");
	assert.equal(typeof environment.index, "string", "There is no index file for the environment");
	assert.equal(typeof environment.index, "string", "There is no index file for the environment");
}

function validatePlugin(plugin) {
	assert.equal(typeof plugin, "object", "The config is not an object");
	assert.equal(typeof plugin.name, "string", "There is no name in the config");
	assert.equal(typeof plugin.version, "string", "There is no version in the config");

	assert(plugin.panel instanceof Array, "The config doesn't contain any environments for the panel");
}

module.exports = class PluginManager {
	constructor() {
		this.plugins = new Map();
	}

	async load() {
		var paths = await pify(FileSystem.readdir)(app.utils.path.resolve("plugins/"));

		paths.forEach(function(path) {
			let plugin;

			try {
				plugin = loadPlugin(path);
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
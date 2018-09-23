const FileSystem = require("fs");
const pify = require("pify");

function loadPlugin(path) {
	let plugin = require(app.utils.path.resolve("plugins/" + path + "/plugin.json"));

	if(!validatePlugin(plugin) || !generatePluginParts(plugin)) {
		return;
	}

	return new Plugin(plugin);
}

function generatePluginParts(plugin) {
	if(plugin.parts) {
		plugin.parts.map(function(part) {
			if(typeof part.env !== "string" || typeof part.lang !== "string" || typeof part.index !== "string") {
				return;
			}

			return new PluginPart(part);
		});

		if(plugin.parts.includes(undefined)) {
			return false;
		}
	}
	else {
		if(typeof plugin.env !== "string" || typeof plugin.lang !== "string" || typeof plugin.index !== "string") {
			return false;
		}

		plugins.parts = [new PluginPart(plugin)];
	}

	return true;
}

function validatePlugin(plugin) {
	if(plugin === undefined) {
		return false;
	}

	if(typeof plugin.name !== "string" || typeof plugin.version !== "string") {
		return false;
	}

	return true;
}

class PluginPart {
	constructor(object) {
		this.environment = object.env;
		this.language = object.lang;
		this.indexFile = object.index;
	}
}

class Plugin {
	constructor(object) {
		this.name = object.name;
		this.version = object.version;
		this.author = object.author;
		this.license = object.license;
		this.parts = object.parts;
	}
}

module.exports = class PluginManager {
	constructor() {
		this.plugins = new Map();
	}

	async load() {
		var paths = await pify(FileSystem.readdir)(app.utils.path.resolve("plugins/"));

		paths.forEach(function(path) {
			let plugin = loadPlugin(path);

			if(plugin === undefined) {
				return console.error("The plugin at /panel/plugins/" + path + " could not be loaded");
			}
			else if(this.plugins.has(plugin.name)) {
				return console.error("The plugin " + plugin.name + " has already been loaded");
			}

			this.plugins.set(plugin.name, plugin);
		}.bind(this));
	}
}
const FileSystem = require("fs");
const Path = require("path");
const pify = require("pify");

module.exports = class PluginManager {
	constructor() {
		this.plugins = {};
	}

	async load() {
		var files = await pify(FileSystem.readdir)(Path.resolve(__dirname, "../../plugins/"));

		console.log(files);
	}
}
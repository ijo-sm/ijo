const FileSystem = require("fs");
const pify = require("pify");

function loadExecutor(path) {
	let executor = require(app.utils.path.resolve("executors/" + path + "/executor.json"));

	if(!validateExecutor(executor)) {
		return;
	}

	executor.executor = require(app.utils.path.resolve("executors/" + path + "/" + executor.index));

	if(typeof executor.executor !== "object") {
		return;	
	}

	return new Executor(executor, path);
}

function validateExecutor(executor) {
	if(executor === undefined) {
		return false;
	}

	if(typeof executor.lang !== "string" || typeof executor.index !== "string") {
		return false;
	}

	return true;
}

class Executor {
	constructor(object, path) {
		this.indexFile = object.index;
		this.language = object.lang;
		this.path = path;
		this.executor = object.executor;
	}
}

module.exports = class ExecutorManager {
	constructor() {
		this.executors = new Map();
	}

	async load() {
		var paths = await pify(FileSystem.readdir)(app.utils.path.resolve("executors/"));

		paths.forEach(function(path) {
			let executor = loadExecutor(path);

			if(executor === undefined) {
				return console.error("The executor at /panel/executors/" + path + " could not be loaded");
			}
			else if(this.executors.has(executor.language)) {
				return console.error("The executor " + executor.language + " has already been loaded");
			}

			this.executors.set(executor.language, executor);
		}.bind(this));
	}

	get(language) {
		return [...this.executors.values()].find(executor => language === executor.language);
	}
}
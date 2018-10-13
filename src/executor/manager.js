const FileSystem = require("fs");
const pify = require("pify");

function loadExecutor(path) {
	let executor = require(app.utils.path.resolve(`executors/${path}/executor.json`));

	if(!validateExecutor(executor)) {
		return;
	}

	executor.module = require(app.utils.path.resolve(`executors/${path}/${executor.index}`));

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
		this.language = object.lang;
		this.path = path;
		this.indexFile = object.index;
		this.module = object.module;
	}

	init() {
		if(typeof this.module.init !== "function") {
			return console.error(`The executor ${this.path} does not have an .init() function`);
		}

		this.module.init();
	}

	start(path) {
		if(typeof this.module.init !== "function") {
			return console.error(`The executor ${this.path} does not have a .start() function`);
		}

		this.module.start(path);
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
				return console.error(`The executor at /panel/executors/${path} could not be loaded`);
			}
			else if(this.executors.has(executor.language)) {
				return console.error(`The executor ${executor.language} has already been loaded`);
			}

			executor.init();

			this.executors.set(executor.language, executor);
		}.bind(this));
	}

	get(language) {
		return [...this.executors.values()].find(executor => language === executor.language);
	}
}
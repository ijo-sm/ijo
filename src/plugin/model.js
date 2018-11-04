
const Assert = require("assert");

function bestEnvironment(enviroments) {
	let panelPlatform = ijo.utils.platform.get();

	enviroments.sort(ijo.utils.array.sortByObjectKey("platform"));

	for(let enviroment of enviroments) {
		if(!ijo.utils.platform.match(enviroment.platform, panelPlatform)) {
			continue;
		}
		
		return enviroment;
	}
}

function parseEnvironments(environment) {
	if(environment === undefined) {
		return [];
	}
	else if(environment instanceof Array) {
		environment.map(function(environment) {
			return new PluginEnvironment(environment);
		});
		
		return environment;
	}

	return [new PluginEnvironment(environment)];
}

class PluginEnvironment {
	constructor(object) {
		this.validate(object);

		this.platform = object.platform;
		this.language = object.lang;
		this.indexFile = object.index;
		this.includes = object.includes;
		this.excludes = object.excludes;
	}

	validate(data) {
		Assert.equal(typeof data, "object", "The environment is not an object");
		Assert.equal(typeof data.lang, "string", "There is no language for the environment");
		Assert.equal(typeof data.index, "string", "There is no index file for the environment");
	}
}

module.exports = class Plugin {
	constructor(path) {
		let object = require(ijo.utils.path.resolve(`plugins/${path}/plugin.json`));

		this.validate(object);

		this.name = object.name;
		this.description = object.description;
		this.version = object.version;
		this.author = object.author;
		this.license = object.license;
		this.panel = parseEnvironments(object.panel);
		this.machine = parseEnvironments(object.machine);
	}

	validate(data) {
		Assert.equal(typeof data, "object", "The config is not an object");
		Assert.equal(typeof data.name, "string", "There is no name in the config");
		Assert.equal(typeof data.version, "string", "There is no version in the config");
	}

	initialize() {
		let enviroment = bestEnvironment(this.panel);

		if(enviroment === undefined) {
			return console.error(`The plugin ${plugin.name} has no matching environments for the panel`);
		}

		let indexFile = require(ijo.utils.path.resolve(`plugins/${path}/${enviroment.indexFile}`));
	}
}
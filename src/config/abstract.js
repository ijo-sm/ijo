const FileSystem = require("fs");
const pify = require("pify");

function createDefaultConfig(defaultPath, destPath) {
	return pify(FileSystem.copyFile)(defaultPath, destPath);
}

function parseConfigBuffer(buffer) {
	try {
		return JSON.parse(buffer.toString());
	}
	catch(e) {
		return;
	}
}

module.exports = class AbstractConfigFile {
	constructor(defaultPath, destPath) {
		this.defaultPath = defaultPath;
		this.destPath = destPath;
	}

	async load() {
		if(!FileSystem.existsSync(this.destPath)) {
			await createDefaultConfig(this.defaultPath, this.destPath);
		}

		this.configData = parseConfigBuffer(await pify(FileSystem.readFile)(this.destPath));

		if(this.configData === undefined) {
			throw new Error(`The config at ${this.destPath} could not be parsed`);
		}

		return this;
	}

	save() {
		return pify(FileSystem.writeFile)(this.destPath, JSON.stringify(this.configData, undefined, "\t"));
	}

	get(key, parent = this.configData) {
		let keysArray = key.split(".");

		if(keysArray.length === 1 || parent[keysArray[0]] === undefined) {
			return parent[key];
		}
		
		let originalKey = keysArray.shift();
    
		return this.get(keysArray.join("."), parent[originalKey]);
	}

	set(key, value, parent = this.configData) {
		let keysArray = key.split(".");
		
		if(keysArray.length === 1) {
			parent[key] = value;

			return parent;
		}

		let originalKey = keysArray.shift();
		
		if(parent[originalKey] === undefined) {
			parent[originalKey] = {};
		}
	
		let newObj = this.set(keysArray.join("."), value, parent[originalKey]);
		parent[originalKey] = newObj;
	
		return parent;
	}
}
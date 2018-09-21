let FileSystem = require("fs");
let ConfigFile = require("./file");

module.exports = class ConfigManager {
	constructor(defaultPath, destPath) {
		this.defaultPath = defaultPath;
		this.destPath = destPath;
	}

	async load() {
		if(!FileSystem.existsSync(this.destPath)) {
			await this.createDefault();
		}

		return new Promise(function(resolve, reject) {
			FileSystem.readFile(this.destPath, function(err, configData) {
				if(err) reject(err);
				else {
					let config;

					try {
						config = JSON.parse(configData.toString());
					} catch(e) {
						reject(new Error("The configuration file at " + this.destPath + " could not be parsed"));
					}

					this.configFile = new ConfigFile(config);

					resolve(this.configFile);
				}
			}.bind(this));
		}.bind(this));
	}

	createDefault() {
		return new Promise(function(resolve, reject) {
			FileSystem.copyFile(this.defaultPath, this.destPath, function(err) {
				if(err) reject(err);
				else resolve();
			});
		}.bind(this));
	}

	save() {
		return new Promise(function(resolve, reject) {
			FileSystem.writeFile(this.destPath, JSON.stringify(this.configFile.config, undefined, "\t"), function(err) {
				if(err) reject(err);
				else resolve();
			});
		}.bind(this));
	}
}
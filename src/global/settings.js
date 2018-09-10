let path = require("path");
let defaultSettingsPath = path.resolve(__dirname, "../../res/defaults/globalSettings.json");
let settingsDestPath = path.resolve(__dirname, "../../../panel.json");
let fs = require("fs");

module.exports = class GlobalSettingsManager {
	async load() {
		if(!fs.existsSync(settingsDestPath)) {
			await this.createDefault();
		}

		return new Promise(function(resolve, reject) {
			fs.readFile(settingsDestPath, function(err, settingsData) {
				if(err) reject(err);
				else {
					let settings;

					try {
						settings = JSON.parse(settingsData.toString());
					} catch(e) {
						reject(new Error("The panel settings could not be parsed"));
					}

					resolve(Object.assign({}, settings));
				}
			});
		});
	}

	createDefault() {
		return new Promise(function(resolve, reject) {
			fs.copyFile(defaultSettingsPath, settingsDestPath, function(err) {
				if(err) reject(err);
				else resolve();
			});
		});
	}

	save(settings) {
		return new Promise(function(resolve, reject) {
			fs.writeFile(settingsDestPath, JSON.stringify(settings, undefined, "\t"), function(err) {
				if(err) reject(err);
				else resolve();
			});
		});
	}
}
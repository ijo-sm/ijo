var path = require("path");
var defaultSettingsPath = path.resolve(__dirname, "../../res/defaults/globalSettings.json");
var settingsDestPath = path.resolve(__dirname, "../../../panel.json");
var fs = require("fs");

module.exports = class GlobalSettingsManager {
	async load() {
		if(!fs.existsSync(settingsDestPath)) {
			await this.createDefault();
		}

		return new Promise(function(resolve, reject) {
			fs.readFile(defaultSettingsPath, function(err, defaultData) {
				if(err) reject(err);

				fs.readFile(settingsDestPath, function(err, settingsData) {
					if(err) reject(err);
					else {
						var settings;
						var defaultSettings;

						try {
							settings = JSON.parse(settingsData.toString());
							defaultSettings = JSON.parse(defaultData.toString());
						} catch(e) {
							reject(new Error("The panel settings could not be parsed"));
						}

						resolve(Object.assign(defaultSettings, settings));
					}
				});
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
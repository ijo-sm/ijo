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
			fs.readFile(settingsDestPath, function(err, data) {
				if(err) reject(err);
				else resolve(JSON.parse(data.toString()));
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
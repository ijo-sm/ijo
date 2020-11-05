const ConfigFile = include("@ijo-sm/helper-config");
const Utils = include("@ijo-sm/utils");

class GlobalConfigFile extends ConfigFile {
	constructor() {
		let defaultPath = Utils.path.resolve("res/defaults/globalConfig.json");
		let destPath = Utils.path.resolve("../panel.json");

		super(defaultPath, destPath);
	}
}

module.exports = new GlobalConfigFile();
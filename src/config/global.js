const ConfigFile = include("@ijo-sm/helper-config");
const Utils = include("@ijo-sm/utils");

class GlobalConfigFile extends ConfigFile {
	constructor() {
		let defaultGlobalConfigPath = Utils.path.resolve("res/defaults/globalConfig.json");
		let destGlobalConfigPath = Utils.path.resolve("../panel.json");

		super(defaultGlobalConfigPath, destGlobalConfigPath);
	}
}

module.exports = new GlobalConfigFile();
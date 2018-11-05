const Path = include("path");
const ConfigFile = include("@ijo-sm/helper-config");

class GlobalConfigFile extends ConfigFile {
	constructor() {
		let defaultGlobalConfigPath = Path.resolve(__dirname, "../../res/defaults/globalConfig.json");
		let destGlobalConfigPath = Path.resolve(__dirname, "../../../panel.json");

		super(defaultGlobalConfigPath, destGlobalConfigPath);
	}
}

module.exports = new GlobalConfigFile();
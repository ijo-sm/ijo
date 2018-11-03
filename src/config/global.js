const Path = require("path");
const ConfigFile = require("@ijo-sm/helper-config");

module.exports = class GlobalConfigFile extends ConfigFile {
	constructor() {
		let defaultGlobalConfigPath = Path.resolve(__dirname, "../../res/defaults/globalConfig.json");
		let destGlobalConfigPath = Path.resolve(__dirname, "../../../panel.json");

		super(defaultGlobalConfigPath, destGlobalConfigPath);
	}
}
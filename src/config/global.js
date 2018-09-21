let Path = require("path");
let ConfigManager = require("./config");

module.exports = class GlobalConfigManager extends ConfigManager {
	constructor() {
		let defaultGlobalConfigPath = Path.resolve(__dirname, "../../res/defaults/globalConfig.json");
		let destGlobalConfigPath = Path.resolve(__dirname, "../../../panel.json");

		super(defaultGlobalConfigPath, destGlobalConfigPath);
	}
}
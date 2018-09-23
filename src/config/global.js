const Path = require("path");
const AbstractConfigFile = require("./abstract");

module.exports = class GlobalConfigFile extends AbstractConfigFile {
	constructor() {
		let defaultGlobalConfigPath = Path.resolve(__dirname, "../../res/defaults/globalConfig.json");
		let destGlobalConfigPath = Path.resolve(__dirname, "../../../panel.json");

		super(defaultGlobalConfigPath, destGlobalConfigPath);
	}
}
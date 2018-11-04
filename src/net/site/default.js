const ViewRoutes = require("./defaults/views");
const ResourceRoutes = require("./defaults/resources");
const APIRoutes = require("./defaults/api");

module.exports = class DefaultRoutes {
	async init() {
		await (new ResourceRoutes()).route();
		await (new ViewRoutes()).route();
		await (new APIRoutes()).route();
	}
}
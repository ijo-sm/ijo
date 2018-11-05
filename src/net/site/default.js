const viewRoutes = include("src/net/site/defaults/views");
const resourceRoutes = include("src/net/site/defaults/resources");
const apiRoutes = include("src/net/site/defaults/api");

class DefaultRoutes {
	async init() {
		await viewRoutes.route();
		await resourceRoutes.route();
		await apiRoutes.route();
	}
}

module.exports = new DefaultRoutes();
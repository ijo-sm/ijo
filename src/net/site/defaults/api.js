const DefaultRoutes = include("src/net/site/defaults/model");
const Route = include("src/net/site/route");
const userAPI = include("src/net/site/defaults/api/user");
const siteServer = include("src/net/site/server");

class APIRoutes extends DefaultRoutes {
	async route() {
		super.route();

		siteServer.route(new Route("/api/login", "POST", userAPI.login));
	}
}

module.exports = new APIRoutes();
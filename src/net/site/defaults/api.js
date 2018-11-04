const DefaultRoutes = require("./model");
const Route = require("../route");
const UserAPI = require("./api/user");

module.exports = class APIRoutes extends DefaultRoutes {
	async route() {
		super.route();

		let userAPI = new UserAPI();
		ijo.siteServer.route(new Route("/api/login", "POST", userAPI.login));
	}
}
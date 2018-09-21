let Route = require("./route");

module.exports = class DefaultRoutes {
	constructor(manager) {
		manager.route(new Route("/", "GET", this.index));
	}

	index(req, res, next) {
		res.end("TEST");
		next();
	}
}
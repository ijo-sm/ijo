const DefaultRoutes = include("src/net/site/defaults/model");
const Route = include("src/net/site/route");
const NodeUtils = include("util");
const FileSystem = include("fs");
const Utils = include("@ijo-sm/utils");
const siteServer = include("src/net/site/server");

class ResourceRoutes extends DefaultRoutes {
	async route() {
		super.route();

		let staticRoutes = [
			// Stylesheets
			{route: "/css/index.css", file: "res/assets/css/index.css", type: "text/css"},
			{route: "/css/login.css", file: "res/assets/css/login.css", type: "text/css"},
			// Scripts
			{route: "/js/panel.min.js", file: "res/assets/js/panel.min.js", type: "application/javascript"},
			{route: "/js/jquery.min.js", file: "res/assets/js/jquery.min.js", type: "application/javascript"},
			{route: "/js/login.js", file: "res/assets/js/login.js", type: "application/javascript"},
			// Fonts
			{route: "/fonts/Quicksand-Bold.ttf", file: "res/assets/fonts/Quicksand-Bold.ttf", type: "font/opentype"},
			{route: "/fonts/Quicksand-Light.ttf", file: "res/assets/fonts/Quicksand-Light.ttf", type: "font/opentype"},
			{route: "/fonts/Quicksand-Medium.ttf", file: "res/assets/fonts/Quicksand-Medium.ttf", type: "font/opentype"},
			{route: "/fonts/Quicksand-Regular.ttf", file: "res/assets/fonts/Quicksand-Regular.ttf", type: "font/opentype"}
		];

		for(let route of staticRoutes) {
			siteServer.route(await this._createStaticRoute(route.route, route.file, route.type));
		}
	}

	_asyncFileLoad(name) {
		return NodeUtils.promisify(FileSystem.readFile)(name);
	}

	async _createStaticRoute(route, file, type = "text/plain") {
		let data = await this._asyncFileLoad(Utils.path.resolve(file));

		let routeFunction = function(req, res) {
			res.setHeader("Content-Type", type);
			res.end(data);
		}

		return new Route(route, "GET", routeFunction);
	}
}

module.exports = new ResourceRoutes();
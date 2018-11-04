const NodeUtils = require("util");
const FileSystem = require("fs");
const DefaultRoutes = require("./model");
const Route = require("../route");

function asyncFileLoad(name) {
	return NodeUtils.promisify(FileSystem.readFile)(name);
}

async function createStaticRoute(route, file, type = "text/plain") {
	let data = await asyncFileLoad(ijo.utils.path.resolve(file));

	let routeFunction = function(req, res) {
		res.setHeader("Content-Type", type);
		res.end(data);
	}

	return new Route(route, "GET", routeFunction);
}

module.exports = class ResourceRoutes extends DefaultRoutes {
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
			ijo.siteServer.route(await createStaticRoute(route.route, route.file, route.type));
		}
	}
}
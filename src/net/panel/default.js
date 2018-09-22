let Route = require("./route");
let FileSystem = require("fs");
let Path = require("path");

function asyncFileLoad(name) {
	return new Promise(function(resolve, reject) {
		FileSystem.readFile(name, function(err, data) {
			if(err) {
				return reject(err);
			}

			resolve(data);
		});
	});
}

async function createStaticRoute(route, file, type = "text/plain") {
	var data = await asyncFileLoad(Path.resolve(__dirname, file));

	let routeFunction = function(req, res, next) {
		res.setHeader("Content-Type", type)
		res.end(data);
		next();
	}

	return new Route(route, "GET", routeFunction);
}

module.exports = class DefaultRoutes {
	constructor(manager) {
		this.manager = manager;
	}

	async init() {
		this.templates = {
			index: this.manager.ejs.template(await asyncFileLoad(Path.resolve(__dirname, "../../../res/assets/views/index.ejs"))),
			login: this.manager.ejs.template(await asyncFileLoad(Path.resolve(__dirname, "../../../res/assets/views/login.ejs")))
		};

		// Stylesheets
		this.manager.route(await createStaticRoute("/css/index.css", "../../../res/assets/css/index.css", "text/css"));
		this.manager.route(await createStaticRoute("/css/login.css", "../../../res/assets/css/login.css", "text/css"));

		// Scripts
		this.manager.route(await createStaticRoute("/js/panel.min.js", "../../../res/assets/js/panel.min.js", "application/javascript"));
		this.manager.route(await createStaticRoute("/js/jquery.min.js", "../../../res/assets/js/jquery.min.js", "application/javascript"));
		this.manager.route(await createStaticRoute("/js/login.js", "../../../res/assets/js/login.js", "application/javascript"));

		// Fonts
		this.manager.route(await createStaticRoute("/fonts/Quicksand-Bold.ttf", "../../../res/assets/fonts/Quicksand-Bold.ttf", "font/opentype"));
		this.manager.route(await createStaticRoute("/fonts/Quicksand-Light.ttf", "../../../res/assets/fonts/Quicksand-Light.ttf", "font/opentype"));
		this.manager.route(await createStaticRoute("/fonts/Quicksand-Medium.ttf", "../../../res/assets/fonts/Quicksand-Medium.ttf", "font/opentype"));
		this.manager.route(await createStaticRoute("/fonts/Quicksand-Regular.ttf", "../../../res/assets/fonts/Quicksand-Regular.ttf", "font/opentype"));

		this.manager.route(new Route("/", "GET", this.index.bind(this)));
		this.manager.route(new Route("/login", "GET", this.login.bind(this)));
	}

	index(req, res, next) {
		if(!req.session.data.userID) {
			res.statusCode = 302;
			res.setHeader("Location", "/login");
		}

		res.end(this.templates["index"].render({}));

		next();
	}

	login(req, res, next) {
		res.end(this.templates["login"].render({}));

		next();
	}
}
const FileSystem = require("fs");
const pify = require("pify");
const Route = require("./route");
const JSONResponse = require("./json");

function asyncFileLoad(name) {
	return pify(FileSystem.readFile)(name);
}

async function createStaticRoute(route, file, type = "text/plain") {
	let data = await asyncFileLoad(app.utils.path.resolve(file));

	let routeFunction = function(req, res) {
		res.setHeader("Content-Type", type);
		res.end(data);
	}

	return new Route(route, "GET", routeFunction);
}

module.exports = class DefaultRoutes {
	async init() {
		this.templates = {
			index: app.siteServer.ejs.template(await asyncFileLoad(app.utils.path.resolve("res/assets/views/index.ejs"))),
			login: app.siteServer.ejs.template(await asyncFileLoad(app.utils.path.resolve("res/assets/views/login.ejs")))
		};
		
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
			app.siteServer.route(await createStaticRoute(route.route, route.file, route.type));
		}

		//Views
		app.siteServer.route(new Route("/", "GET", this.index.bind(this)));
		app.siteServer.route(new Route("/login", "GET", this.login.bind(this)));

		//Api
		app.siteServer.route(new Route("/api/login", "POST", this.apiLogin.bind(this)));
	}

	index(req, res) {
		if(!req.session.data.userID) {
			res.statusCode = 302;
			res.setHeader("Location", "/login");
			res.setHeader("Content-Type", "application/json");
			res.end();

			return;
		}

		res.end(this.templates["index"].render({}));
	}

	login(req, res) {
		res.end(this.templates["login"].render({}));
	}

	apiLogin(req, res) {
		var jsonResponse = new JSONResponse(req, res);

		req.getBody()
		.then(function(body) {
			if(req.session.data.userID) {
				return jsonResponse.error(403, "User is already logged in.");
			}

			try {
				body = JSON.parse(body);
			}
			catch(e) {
				return jsonResponse.error(400, "The request body could not be parsed.");
			}

			var user = app.users.getUser("username", body.username);

			if(user === undefined || !user.checkPassword(body.password)) {
				return jsonResponse.error(400, "The username and/or password are incorrect .");
			}
	
			res.end(JSON.stringify({code: 200, title: "Succes", userID: req.session.data.userID = user.id}));
		});
	}
}
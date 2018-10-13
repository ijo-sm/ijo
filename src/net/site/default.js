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
		res.setHeader("Content-Type", type)
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

		// Stylesheets
		app.siteServer.route(await createStaticRoute("/css/index.css", "res/assets/css/index.css", "text/css"));
		app.siteServer.route(await createStaticRoute("/css/login.css", "res/assets/css/login.css", "text/css"));

		// Scripts
		app.siteServer.route(await createStaticRoute("/js/panel.min.js", "res/assets/js/panel.min.js", "application/javascript"));
		app.siteServer.route(await createStaticRoute("/js/jquery.min.js", "res/assets/js/jquery.min.js", "application/javascript"));
		app.siteServer.route(await createStaticRoute("/js/login.js", "res/assets/js/login.js", "application/javascript"));

		// Fonts
		app.siteServer.route(await createStaticRoute("/fonts/Quicksand-Bold.ttf", "res/assets/fonts/Quicksand-Bold.ttf", "font/opentype"));
		app.siteServer.route(await createStaticRoute("/fonts/Quicksand-Light.ttf", "res/assets/fonts/Quicksand-Light.ttf", "font/opentype"));
		app.siteServer.route(await createStaticRoute("/fonts/Quicksand-Medium.ttf", "res/assets/fonts/Quicksand-Medium.ttf", "font/opentype"));
		app.siteServer.route(await createStaticRoute("/fonts/Quicksand-Regular.ttf", "res/assets/fonts/Quicksand-Regular.ttf", "font/opentype"));

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
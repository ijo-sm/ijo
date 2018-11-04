const NodeUtils = require("util");
const FileSystem = require("fs");
const DefaultRoutes = require("./model");
const Route = require("../route");

function asyncFileLoad(name) {
	return NodeUtils.promisify(FileSystem.readFile)(name);
}

module.exports = class ViewRoutes extends DefaultRoutes {
	async route() {
		super.route();

		this.templates = {
			index: ijo.siteServer.ejs.template(await asyncFileLoad(ijo.utils.path.resolve("res/assets/views/index.ejs"))),
			login: ijo.siteServer.ejs.template(await asyncFileLoad(ijo.utils.path.resolve("res/assets/views/login.ejs")))
		};

		ijo.siteServer.route(new Route("/", "GET", this.index.bind(this)));
		ijo.siteServer.route(new Route("/login", "GET", this.login.bind(this)));
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
}
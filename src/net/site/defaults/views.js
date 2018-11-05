const DefaultRoutes = include("src/net/site/defaults/model");
const Route = include("src/net/site/route");
const NodeUtils = include("util");
const FileSystem = include("fs");
const Utils = include("@ijo-sm/utils");
const siteServer = include("src/net/site/server");
const ejs = include("src/net/site/ejs");

class ViewRoutes extends DefaultRoutes {
	async route() {
		super.route();

		this.templates = {
			index: ejs.template(await this._asyncFileLoad(Utils.path.resolve("res/assets/views/index.ejs"))),
			login: ejs.template(await this._asyncFileLoad(Utils.path.resolve("res/assets/views/login.ejs")))
		};

		siteServer.route(new Route("/", "GET", this.index.bind(this)));
		siteServer.route(new Route("/login", "GET", this.login.bind(this)));
	}

	_asyncFileLoad(name) {
		return NodeUtils.promisify(FileSystem.readFile)(name);
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

module.exports = new ViewRoutes();
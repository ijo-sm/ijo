const URL = include("url");
const HTTPServer = include("src/net/server/http");
const CookieManager = include("src/net/site/cookies");
const sessionManager = include("src/net/site/sessions");
const globalConfig = include("src/config/global");

class SiteServer {
	constructor() {
		this.server = undefined;
		this.routes = [];
	}

	start() {
		sessionManager.start();

		this.server = new HTTPServer(this.handle.bind(this));
		this.server.port = globalConfig.get("siteServer.port");

		return this.server.start();
	}

	stop() {
		sessionManager.stop();

		return this.server.stop();
	}

	route(route) {
		this.routes.push(route);
	}

	async handle(request, response) {
		this._prepareRequest(request);
		this._prepareResponse(response, request);

		let path = this._extractPath(request.url);
		let method = request.method;
		let next = () => {};

		for(let route of this.routes) {
			if(!route.match({path, method})) {
				continue;
			}

			return route.callback(request, response, next);
		}

		response.statusCode = 404;
		response.end("Error: 404");
	}

	_prepareRequest(request) {
		request.getBody = this._getBody(request);
		request.cookies = this._parseCookies(request.headers["cookie"]);
		request.session = sessionManager.get(
			request.cookies.find(cookie => cookie.key === globalConfig.get("siteServer.sessions.cookie.name"))
		);
	}

	_prepareResponse(response, request) {
		let endFunction = response.end;
	
		response.cookies = new CookieManager();
		response.cookies.set(
			globalConfig.get("siteServer.sessions.cookie.name"),
			request.session.id,
			{path: "/"}
		);
	
		response.end = function() {
			response.setHeader("Set-Cookie", response.cookies.build());
	
			endFunction.apply(response, arguments);
		};
	}

	_getBody(request) {
		return () => new Promise(function(resolve, reject) {
			let body = "";
	
			request.on("data", function(chunk) {
				body += chunk;
			});
	
			request.on("error", function(err) {
				reject(err);
			});
	
			request.on("end", function() {
				resolve(body);
			});
		});
	}

	_extractPath(path) {
		return URL.parse(path).pathname;
	}

	_parseCookies(header) {
		let cookies = [];

		if(header === undefined) {
			return cookies;
		}
	
		cookies = header.split(";");
	
		return cookies.map(function(cookie) {
			cookie = cookie.trim();
	
			return {
				key: cookie.substring(0, cookie.indexOf("=")),
				value: cookie.substring(cookie.indexOf("=") + 1)
			}
		});
	}
}

module.exports = new SiteServer();
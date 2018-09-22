let HTTPServer = require("./http");
let CookieManager = require("./cookies");
let EJS = require("./ejs");

module.exports = class ServerManager {
	constructor() {
		this.server = undefined;
		this.sessionManager = new (require("./sessions"))();
		this.ejs = new EJS();
		this.routes = [];
	}

	start(config) {
		this.config = config;

		this.sessionManager.init(this.config);

		if(this.config.get("server.secure")) {
			// Create HTTPS server
		}
		else {
			this.server = new HTTPServer(this.config, this.handle.bind(this));
			this.server.start();
		}
	}

	route(route) {
		this.routes.push(route);
	}

	async handle(request, response) {
		this.prepareRequest(request);
		this.prepareResponse(response, request);

		let path = extractPath(request.url);
		let method = request.method;
		let next = function() {}

		for(let i = 0; i < this.routes.length; i++) {
			let route = this.routes[i];
			
			if((path === route.path || (route.path.endsWith("*") && path.startsWith(route.path.substring(0, route.path.indexOf("*"))))) && (method === route.method || method === "*")) {
				route.callback(request, response, next);
				return;
			}
		}

		response.statusCode = 404;
		response.end("Error: 404");
	}

	prepareResponse(response, request) {
		let endFunction = response.end;

		response.cookies = new CookieManager();
		response.cookies.setCookie(
			this.config.get("server.sessions.cookie.name"),
			request.session.id
		);
		response.end = function() {
			response.setHeader("Set-Cookie", response.cookies.buildCookies());

			endFunction.apply(response, arguments);
		};
	}

	prepareRequest(request) {
		request.getBody = function() {
			return new Promise(function(resolve, reject) {
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

		request.cookies = parseCookies(request.headers);
		request.session = this.sessionManager.get(
			request.cookies.find(cookie => cookie.key === this.config.get("server.sessions.cookie.name"))
		);
	}
}

function parseCookies(headers) {
	let cookies = [];

	if(headers["cookie"] === undefined) {
		return cookies;
	}

	cookies = headers["cookie"].split(";");

	for(let i = 0; i < cookies.length; i++) {
		let cookie = cookies[i].trim();

		cookies[i] = {
			key: cookie.substring(0, cookie.indexOf("=")),
			value: cookie.substring(cookie.indexOf("=") + 1)
		}
	}

	return cookies;
}

function extractPath(path) {
	return require("url").parse(path).pathname;
}
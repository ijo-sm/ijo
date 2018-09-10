let HTTPServer = require("./http");
let CookieManager = require("./cookies");

module.exports = class ServerManager {
	constructor() {
		this.server = undefined;
		this.sessionManager = new (require("./sessions"))();
	}

	start(settings) {
		this.settings = settings;

		this.sessionManager.init(settings.sessions);

		if(this.settings.secure) {
			// Create HTTPS server
		}
		else {
			this.server = new HTTPServer(this.settings, this.handle.bind(this));
			this.server.start();
		}
	}

	async handle(request, response) {
		this.prepareRequest(request, response);

		response.end("Hello World!");
	}

	prepareRequest(request, response) {
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
			request.cookies.find(cookie => cookie.key === this.settings.sessions.cookie.name)
		);

		response.setHeader("Set-Cookie", this.settings.sessions.cookie.name + "=" + request.session.id + "; Path=/");
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
var HTTPServer = require("./http");

module.exports = class ServerManager {
	constructor() {
		this.server = undefined;
	}

	start(settings) {
		this.settings = settings;

		if(this.settings.secure) {
			// Create HTTPS server
		}
		else {
			this.server = new HTTPServer(this.settings, this.handle);
			this.server.start();
		}
	}

	async handle(request, response) {
		prepareRequest(request);

		console.log(await request.getBody());
	}
}

function prepareRequest(request) {
	request.getBody = function() {
		return new Promise(function(resolve, reject) {
			var body = "";

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
}
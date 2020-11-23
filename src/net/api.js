const http = require("http");
const util = require("util");
const {URL} = require("url");

class Api {
	constructor() {
		this.stack = [];
	}

	register(path, method = "*", callback) {
		this.stack.push({
			path, method, callback
		});
	}

	unregister(path) {
		const handlerIndex = this.stack.findIndex(handler => handler.path === path);

		if(handlerIndex < 0) return;

		this.stack.splice(handlerIndex);
	}

	initialize() {
		this.server = http.createServer((req, res) => {
			this.handle(req, res).catch(err => this.handleError(err))
		});
		this.server.on("error", err => this.handleError(err));
	}

	async handle(req, res) {
		const url = new URL(req.url, "http://localhost/");

		for(let handler of this.stack) {
			if(handler.method !== "*" && handler.method !== req.method) continue;

			const pathData = this.parsePath(handler.path, url.pathname);

			if(pathData === undefined) continue;

			handler.callback(req, res, pathData);
		}

		res.statusCode = 404;
		res.end();
	}

	parsePath(template, path) {
		const templateParts = template.split("/");
		const pathParts = path.split("/");
		const data = {};

		for(let i = 0; i < templateParts.length; i++) {
			const templatePart = templateParts[i];
			const pathPart = pathParts[i];

			if(templatePart.startsWith(":")) {
				if(pathPart === undefined) return;
				const key = templatePart.substring(1, templatePart.length);

				data[key] = pathPart;
			}
			else if(templatePart === "*") return data;
			else if(templatePart !== pathPart) return;
		}

		return data;
	}

	handleError(err) {
		throw err;
	}

	startServer({port} = {}) {
		const options = {
			port
		};

		return util.promisify(this.server.listen.bind(this.server))(options).catch(err => this.handleError(err));
	}

	closeServer() {
		return util.promisify(this.server.close.bind(this.server))().catch(err => this.handleError(err));
	}
}

module.exports = Api;
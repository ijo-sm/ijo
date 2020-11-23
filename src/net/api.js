const http = require("http");
const util = require("util");

class Api {
	initialize() {
		this.server = http.createServer((req, res) => {
			this.handle(req, res).catch(err => this.handleError(err))
		});
		this.server.on("error", err => this.handleError(err));
	}

	async handle(req, res) {

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
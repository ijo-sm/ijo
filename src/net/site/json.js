module.exports = class JSONResponse {
	constructor(request, response) {
		this.request = request;
		this.response = response;

		this.response.setHeader("Content-Type", "application/json");
	}

	error(code, reason) {
		this.response.statusCode = code;
		this.response.end(JSON.stringify({code, reason}));
	}
}
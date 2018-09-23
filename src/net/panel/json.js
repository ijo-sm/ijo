module.exports = class JSONResponse {
	constructor(request, response, next) {
		this.request = request;
		this.response = response;
		this.next = next;

		this.response.setHeader("Content-Type", "application/json");
	}

	error(code, reason) {
		this.response.statusCode = code;
		this.response.end(JSON.stringify({code, reason}));

		return this.next();
	}
}
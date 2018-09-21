module.exports = class Route {
	constructor(path, method = "*", callback) {
		this.path = path;
		this.method = method;
		this.callback = callback;
	}
}
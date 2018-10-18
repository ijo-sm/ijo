module.exports = class Route {
	constructor(path, method = "*", callback) {
		this.path = path;
		this.method = method;
		this.callback = callback;
	}

	match(request) {
		if(this.method !== "ALL" && this.method !== request.method) {
			return false;
		}
	
		if(this.path === "*") {
			return true;
		}
	
		if(this.path === request.path) {
			return true;
		} 
		
		if(this.path.endsWith("*") && request.path.startsWith(this.path.substring(0, this.path.indexOf("*")))) {
			return true;	
		}
	
		return false;
	}
}
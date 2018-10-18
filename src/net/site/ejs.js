class EJSTemplate {
	constructor(ejs, str, options) {
		this.str = str;
		this.options = options;
		
		this.compiled = ejs.compile(this.str, this.options);
	}

	render(data) {
		return this.compiled(data);
	}
}

module.exports = class EJS {
	constructor() {
		this.ejs = require("ejs");
		this.includes = {};

		this.ejs.originalFileLoader = this.ejs.fileLoader;

		this.ejs.fileLoader = function(name) {
			if(this.includes[name]) {
				return this.includes[name];
			}
			
			return this.originalFileLoader(name);
		}.bind(this);
	}

	template(str, options) {
		if(str instanceof Buffer) {
			str = str.toString();
		}

		return new EJSTemplate(this.ejs, str, options);
	}

	render(str, data, options) {
		return this.ejs.render(str, data, options);
	}

	renderFile(str, data, options, callback) {
		this.ejs.render(str, data, options, callback);
	}

	addInclude(name, str) {
		this.includes[name] = str;
	}

	removeInclude(name) {
		delete this.includes[name];
	}
}
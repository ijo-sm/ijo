class Cookie {
	constructor(name, value, options) {
		this.name = name;
		this.value = value;
		this.options = options;
	}

	build() {
		let cookie = `${this.name}=${this.value}`;

		if(this.options.expires instanceof Date) {
			cookie += `; Expires=${this.options.expires.toString()}`;
		}

		if(typeof this.options.maxAge === "number") {
			cookie += `; Max-Age=${this.options.maxAge}`;
		}

		if(typeof this.options.domain === "string") {
			cookie += `; Domain=${this.options.domain}`;
		}

		if(typeof this.options.path === "string") {
			cookie += `; Path=${this.options.path}`;
		}

		if(this.options.secure) {
			cookie += "; Secure";
		}

		if(this.options.httpOnly) {
			cookie += "; HttpOnly";
		}

		return cookie;
	}
}

module.exports = class CookieManager {
	constructor() {
		this.map = new Map();
	}

	set(name, value, options = {}) {
		return this.map.set(name, new Cookie(name, value, options))
	}

	get(name) {
		return this.map.get(name);
	}

	has(name) {
		return this.map.has(name);
	}

	remove(name) {
		return this.map.delete(name);
	}

	get() {
		return Array.from(this.map.values());
	}

	build() {
		return [...this.map.values()].map(cookie => cookie.build());
	}
}
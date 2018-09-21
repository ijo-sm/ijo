module.exports = class CookieManager {
	constructor() {
		this.map = new Map();
	}

	setCookie(name, value, options = {}) {
		return this.map.set(name, new Cookie(name, value, options))
	}

	getCookie(name) {
		return this.map.get(name);
	}

	hasCookie(name) {
		return this.map.has(name);
	}

	removeCookie(name) {
		return this.map.delete(name);
	}

	getCookies() {
		return Array.from(this.map.values());
	}

	buildCookies() {
		let cookies = [];

		for(let cookie of this.map.values()) {
			cookies.push(cookie.build());
		}

		return cookies;
	}
}

class Cookie {
	constructor(name, value, options) {
		this.name = name;
		this.value = value;
		this.options = options;
	}

	build() {
		let cookie = this.name + "=" + this.value;

		if(this.options.expires instanceof Date) {
			cookie += "; Expires=" + this.options.expires.toString();
		}

		if(typeof this.options.maxAge === "number") {
			cookie += "; Max-Age=" + this.options.maxAge;
		}

		if(typeof this.options.domain === "string") {
			cookie += "; Domain=" + this.options.domain;
		}

		if(typeof this.options.path === "string") {
			cookie += "; Path=" + this.options.path;
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
const Crypto = require("crypto");
const ShortID = require("shortid");
const Path = require("path");
const OS = require("os");
const PlatformUtilities = require("./platform");

class CryptoUtilities {
	hash(data, options = {}) {
		options = Object.assign({}, options, {
			algorithm: "sha256",
			output: "hex"
		});

		return Crypto.createHash(options.algorithm).update(data).digest(options.output);
	}
}

class GenerateUtilities {
	shortid() {
		return ShortID.generate();
	}

	uuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	
			return v.toString(16);
		});
	}
}

class PathUtilities {
	resolve(path) {
		return Path.resolve(__dirname, "../../", path);
	}
}

module.exports = class Utilities {
	constructor() {
		this.crypto = new CryptoUtilities();
		this.generate = new GenerateUtilities();
		this.path = new PathUtilities();
		this.platform = new PlatformUtilities();
	}
}
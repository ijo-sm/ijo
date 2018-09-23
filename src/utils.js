const Crypto = require("crypto");
const ShortID = require("shortid");

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

module.exports = class Utilities {
	constructor() {
		this.crypto = new CryptoUtilities();
		this.generate = new GenerateUtilities();
	}
}
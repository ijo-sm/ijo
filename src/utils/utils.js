const Crypto = require("crypto");
const ShortID = require("shortid");
const Path = require("path");
const PlatformUtilities = require("./platform");

class CryptoUtilities {
	hash(data, options = {}) {
		options = Object.assign({}, options, {
			algorithm: "sha256",
			output: "hex"
		});

		return Crypto.createHash(options.algorithm).update(data).digest(options.output);
	}

	generateSecret(options) {
		options = Object.assign({}, options, {
			length: 32,
			output: "hex"
		});

		return Crypto.randomBytes(options.length).toString(options.output);
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

class ArrayUtilities {
	sortByObjectKey(key) {
		return (a, b) => {
			if(a[key] < b[key]) {
				return -1;
			}
			else if(a[key] > b[key]) {
				return 1;
			}

			return 0;
		}
	}
}

class ProcessUtilities {
	onExit(callback) {
		process.on('message', message => {
			if(typeof message !== "object" || message.message !== "kill") {
				return;
			}

			callback(() => {
				process.exit(123);
			});
		});

		process.on("SIGINT", () => {});
	}
}

class Utilities {
	constructor() {
		this.crypto = new CryptoUtilities();
		this.generate = new GenerateUtilities();
		this.path = new PathUtilities();
		this.platform = new PlatformUtilities();
		this.array = new ArrayUtilities();
		this.process = new ProcessUtilities();
	}
}

module.exports = new Utilities();
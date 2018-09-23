const Crypto = require("crypto");
const ShortID = require("shortid");
const Path = require("path");

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
		return Path.resolve(__dirname, "../", path);
	}
}

const platformRankData = {
	"win32.windows": ["7", "80", "81", "10"],
	"linux.ubuntu": ["1404", "1604"],
	"linux.debian": ["9", "8"],
	"linux.mint": ["17", "171", "172"],
	"linux.rhel": ["5", "6", "7"],
	"linux.centos": ["5", "6", "7"],
	"linux.fedora": ["19", "20", "21"],
	"linux.cloud": ["6"],
	"linux.oracle": ["5", "6", "7"],
	"linux.amazon": ["201703", "201709", "201803"],
	"linux.freebsd": ["110", "111", "112"],
	"darwin.macos": ["10.11", "10.12", "10.13", "10.14"]
}

class PlatformUtilities {
	match(master, slave) {
		let masterArray = master.split(".");
		let slaveArray = slave.split(".");

		if(masterArray[0] === "*") {
			return true;
		}
		else if(masterArray[0] !== slaveArray[0]) {
			return false;
		}
		else if(masterArray[1] === "*") {
			return true;
		}
		else if(masterArray[1] !== slaveArray[1]) {
			return false;
		}
		else if(masterArray[2] === "*") {
			return true;
		}
		else if(masterArray[2] === slaveArray[2]) {
			return true;
		}
	  
		let masterPlatformRanks = platformRankData[masterArray.slice(0, 2).join(".")];
		let masterRelease = masterArray[2].substring(0, masterArray[2].indexOf("+"));
		let slaveRelease = slaveArray[2];
		
		if(!masterPlatformRanks || !masterPlatformRanks.includes(masterRelease) || !masterPlatformRanks.includes(slaveRelease)) {
			return false;
		}
		else if(masterArray[2].endsWith("+") && masterPlatformRanks.indexOf(masterRelease) <= masterPlatformRanks.indexOf(slaveRelease)) {
			return true;
		}
	  
		return false;
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
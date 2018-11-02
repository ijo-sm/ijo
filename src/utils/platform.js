const OS = require("os");

const platformRanks = {
	"win32.windows": ["7", "80", "81", "10"],
	"linux.ubuntu": ["1404", "1604"],
	"linux.debian": ["9", "8"],
	"linux.mint": ["17", "171", "172"],
	"linux.rhel": ["5", "6", "7"],
	"linux.centos": ["5", "6", "7"],
	"linux.fedora": ["19", "20", "21"],
	"linux.amazon": ["201703", "201709", "201803"],
	"linux.freebsd": ["110", "111", "112"],
	"darwin.macos": ["10.11", "10.12", "10.13", "10.14"]
}

const linuxDistroPerFile = {
	"/etc/lsb-release": ["ubuntu","mint"],
	"/etc/system-release": ["amazon"],
	"/etc/debian_version": ["debian"],
	"/etc/fedora-release": ["fedora"],
	"/etc/redhat-release": ["rhel","centos"],
	"/linprocfs/version": ["freebsd"]
}

function getDistro() {

}

module.exports = class PlatformUtilities {
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
	  
		let masterPlatformRanks = platformRanks[masterArray.slice(0, 2).join(".")];
		let masterRelease = masterArray[2].substring(0, masterArray[2].indexOf("+"));
		let slaveRelease = slaveArray[2];
		
		if(!masterPlatformRanks || !masterPlatformRanks.includes(masterRelease) 
		  || !masterPlatformRanks.includes(slaveRelease)) {
			return false;
		}
		else if(masterArray[2].endsWith("+") 
		  && masterPlatformRanks.indexOf(masterRelease) <= masterPlatformRanks.indexOf(slaveRelease)) {
			return true;
		}
	  
		return false;
	}

	get() {
		let platform = OS.platform();
		let distro;
		let release;

		switch(platform) {
			case "win32":
				distro = "windows";
				release = OS.release().split(".")[0];
				break;

			case "darwin":
				distro = "macos";
				break;

			case "linux":
				distro = getDistro();
				break;

			default:
				return;
		}

		return platform + "." + distro + "." + release;
	}
}
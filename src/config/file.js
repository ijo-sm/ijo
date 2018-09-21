module.exports = class ConfigFile {
	constructor(config) {
		this.config = config;
	}

	get(key, parent = this.config) {
		let splitKeys = key.split(".");

		if(splitKeys.length > 1 && parent[splitKeys[0]] !== undefined) {
			let originalKey = splitKeys[0];
    
			splitKeys.splice(0, 1);
    
			return this.get(splitKeys.join("."), parent[originalKey]);
		}
  
		return parent[key];
	}

	set(key, value, parent = this.config) {
		let splitKeys = key.split(".");
		
		if(splitKeys.length > 1) {
			let originalKey = subKeys[0];
		
			splitKeys.splice(0, 1);
		
			if(parent[originalKey] === undefined) parent[originalKey] = {};
		
			let newObj = this.set(splitKeys.join("."), value, parent[originalKey]);
			parent[originalKey] = newObj;
		
			return parent;
		}
		else {
			parent[key] = value;
			return parent;
		}
	}
}
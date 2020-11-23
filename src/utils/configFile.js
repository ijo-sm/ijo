const fs = require("fs");
const FSUtils = require("./fsUtils");

class ConfigFile {
	constructor(path, {defaults = {}} = {}) {
		this.path = path;
		this.data = undefined;
		this.options = {defaults};
		this.loaded = false;
	}

	get(key) {
		return this.data[key];
	}

	async load() {
		if(!FSUtils.exists(this.path) || !(await FSUtils.isFile(this.path).catch(err => {throw err}))) {
			if(!this.options.defaults) throw Error("File not found.");

			this.data = this.options.defaults;
			this.loaded = true;
			await this.save().catch(err => {throw err});

			return;
		}

		this.data = await new Promise((resolve, reject) => {
			fs.readFile(this.path, (err, data) => {
				if(err) reject(err);
				else {
					try {
						resolve(JSON.parse(data.toString()));
					}
					catch(err) {
						reject(err);
					}
				}
			});
		}).catch(err => {throw err});
		this.loaded = true;
	}

	loadSync() {
		if(!FSUtils.exists(this.path) || !this.isFileSync()) {
			if(!this.options.defaults) throw Error("File not found.");

			this.data = this.options.defaults;
			this.loaded = true;
			this.saveSync();

			return;
		}

		try {
			const data = fs.readFileSync(this.path);
			this.data = JSON.parse(data.toString());
			this.loaded = true;
		}
		catch(err) {
			throw err;
		}
	}

	isFileSync() {
		return fs.statSync(this.path).isFile();
	}

	save() {
		return new Promise((resolve, reject) => {
			fs.writeFile(this.path, this.toString({space: "  "}), err => {
				if(err) reject(err);
				else resolve();
			});
		});
	}

	saveSync() {
		fs.writeFileSync(this.path, this.toString({space: "  "}));
	}

	toString({replacer, space} = {}) {
		return JSON.stringify(this.data, replacer, space);
	}
}

module.exports = ConfigFile;
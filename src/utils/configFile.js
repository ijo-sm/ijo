const fs = require("fs");

class ConfigFile {
	constructor(path, {defaults = {}} = {}) {
		this.path = path;
		this.data = undefined;
		this.options = {defaults};
	}

	get(key) {
		return this.data[key];
	}

	async load() {
		if(!this.exists() || !(await this.isFile().catch(err => {throw err}))) {
			if(!this.options.defaults) throw Error("File not found.");

			this.data = this.options.defaults;
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
	}

	loadSync() {
		if(!this.exists() || !this.isFileSync()) {
			if(!this.options.defaults) throw Error("File not found.");

			this.data = this.options.defaults;
			this.saveSync();

			return;
		}

		try {
			const data = fs.readFileSync(this.path);
			this.data = JSON.parse(data.toString());
		}
		catch(err) {
			throw err;
		}
	}

	isFileSync() {
		return fs.statSync(this.path).isFile();
	}

	isFile() {
		return new Promise((resolve, reject) => {
			fs.stat(this.path, (err, stats) => {
				if(err) reject(err);
				else resolve(stats.isFile());
			});
		});
	}

	exists() {
		return fs.existsSync(this.path);
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
const fs = require("fs");
const FSUtils = require("./fsUtils");

/**
 * This is utility for managing a configuration file.
 */
class ConfigFile {
	/**
	 * On construction this will not only add the specified path and options to the instance, but will also set loaded 
	 * to false. This value will become true when the configuration file is loaded.
	 * @param {String} path The path of the config file.
	 * @param {Object} options The options for config file.
	 * @param {Object} options.defaults The defaults that will be used if no config file was found.
	 */
	constructor(path, {defaults = {}} = {}) {
		this.path = path;
		this.data = undefined;
		this.options = {defaults};
		this.loaded = false;
	}

	/**
	 * Returns the specified key from the loaded configuration file.
	 * @param {String} key The key to get a value for.
	 * @returns {any} The value for that key.
	 */
	get(key) {
		// TODO: Maybe throw error here?
		if(!this.loaded) return undefined;

		return this.data[key];
	}

	/**
	 * Loads the configuration file asynchronously. If the file is not found and there are defaults that have been 
	 * defined then these will be used and also saved to the file. When the configuration has been loaded the loaded
	 * state is changed to true.
	 * @returns {Promise} A promise that is resolved when the config has been loaded.
	 */
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

	/**
	 * Loads the configuration file synchronously.
	 */
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

	/**
	 * Returns synchronously if the specified path is actually a file.
	 * @returns {Boolean} A boolean if the config file is actually a file.
	 */
	isFileSync() {
		return fs.statSync(this.path).isFile();
	}

	/**
	 * Saves the configuration file asynchronously and adds some spacing for better readability.
	 * @returns {Promise} A promise that is resolved after the config file has been saved.
	 */
	save() {
		return new Promise((resolve, reject) => {
			fs.writeFile(this.path, this.toString({space: "  "}), err => {
				if(err) reject(err);
				else resolve();
			});
		});
	}

	/**
	 * Saves the configuration file synchronously.
	 */
	saveSync() {
		fs.writeFileSync(this.path, this.toString({space: "  "}));
	}

	/**
	 * Stringifies the data in this configuration file using the optional settings.
	 * @param {Object} options The options for stringifying.
	 * @param {Function} options.replacer See {@link JSON.stringify}.
	 * @param {String} options.space See {@link JSON.stringify}.
	 * @returns {String} The stringified version of the config.
	 */
	toString({replacer, space} = {}) {
		return JSON.stringify(this.data, replacer, space);
	}
}

module.exports = ConfigFile;
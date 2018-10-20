const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");

function loadDatabase(file) {
	return low(new FileAsync(file));
}

function mapToDefaults(map) {
	let defaults = {};

	for(const [key, value] of map) {
		defaults[key] = [];
	}

	return defaults;
}

class Collection {
	constructor(name) {
		this.name = name;
	}

	async initialize(collection) {
		this.collection = collection;
	}
}

module.exports = class Database {
	constructor() {
		this.collections = new Map();
	}

	async load() {
		this.database = await loadDatabase(Utils.path.resolve("../data/panel.json"));

		await this.database.defaults(mapToDefaults(this.collections)).write();

		for(const [name, collection] of this.collections) {
			await collection.initialize(this.database.get(name));
		}
	}

	create(name) {
		this.collections.set(name, new Collection(name));
	}

	has(name) {
		return this.collections.has(name);
	}

	get(name) {
		if(!this.has(name)) {
			return undefined;
		}

		return this.collections.get(name).collection;
	}
}
const nodePath = require("path");
const fs = require("fs");
const {ConfigFile, FSUtils} = require("ijo-utils");
const Collection = require("./collection");
const Database = require("./database");

class JSONCollection extends Collection {
	constructor(name, modelClass, path) {
		super(name, modelClass);

		this.name = name;
		this.path = path;

		const defaults = {};
		defaults[this.name] = [];
		this.config = new ConfigFile(this.path, {defaults});
	}

	get data() {
		if(!this.config.loaded) return [];

		return this.config.get(this.name);
	}

	load() {
		return this.config.load();
	}

	matchQuery(item, query) {
		for(const key of Object.keys[query]) {
			if(query[key] !== item[key]) return false;
		}

		return true;
	}

	async find(query) {
		super.find(query);

		if(!this.config.loaded) await this.config.load();

		return this.data.filter(item => this.matchQuery(item, query)).map(item => new (this.modelClass)(item));
	}

	async findOne(query) {
		super.findOne(query);

		return (await this.find(query))[0];
	}

	async add(items) {
		super.add(items);

		if(!this.config.loaded) await this.config.load();

		for(const item of items) {
			this.data.push(item.toObject());
		}
	}

	addOne(item) {
		super.addOne(item);

		return this.add([item]);
	}

	async remove(query, {replace} = {}) {
		super.remove(query);

		if(!this.config.loaded) await this.config.load();

		for(let item of this.data) {
			if(!this.matchQuery(item, query)) continue;

			this.data.splice(this.data.indexOf(item), 1, replace);
		}
	}

	async removeOne(query, {replace} = {}) {
		super.removeOne(query);

		if(!this.config.loaded) await this.config.load();

		for(let item of this.data) {
			if(!this.matchQuery(item, query)) continue;

			this.data.splice(this.data.indexOf(item), 1, replace);

			return;
		}
	}

	update(query, item) {
		super.update(query, item);

		return this.remove(query, {replace: item.toObject()});
	}

	updateOne(query, item) {
		super.updateOne(query, item);

		return this.removeOne(query, {replace: item.toObject()});
	}

	save() {
		return this.config.save();
	}
}

/**
 * This is the JSON implementation for databasing. As this implementation is relatively small, since it relies on the 
 * ConfigFile class, it is included by default.
 */
class JSONDatabase extends Database {
	constructor({path} = {}, {root} = {}) {
		super();

		this.path = path === undefined ? root : nodePath.join(root, path);
	}

	register(name, modelClass) {
		super.register(name, modelClass);

		this.collections.push(new JSONCollection(name, modelClass, nodePath.join(this.path, `${name}.json`)));
	}

	unregister(name) {
		this.collections.splice(this.collection.findIndex(collection => collection.name === name));
	}

	collection(name) {
		super.collection(name);

		return this.collections.find(collection => collection.name === name);
	}

	async load() {
		if(!fs.existsSync(this.path) || !(await FSUtils.isFolder(this.path).catch(err => {throw err}))) {
			await FSUtils.createFolder(this.path).catch(err => {throw err});
		}

		for(const collection of this.collections) {
			await collection.load();
		}
	}

	async close() {
		super.close();

		for(const collection of this.collections) {
			await collection.save();
		}
	}
}

module.exports = JSONDatabase;
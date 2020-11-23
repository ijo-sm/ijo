class Collection {
	constructor(name, modelClass) {
		this.name = name;
		this.modelClass = modelClass;
	}

	find(query) {}
	findOne(query) {}
	add(items) {}
	addOne(item) {}
	remove(query) {}
	removeOne(query) {}
	update(query, item) {}
}

module.exports = Collection;
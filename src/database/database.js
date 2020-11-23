class Database {
	constructor() {
		this.collections = [];
	}

	register(name, modelClass) {}
	unregister(name) {}
	collection(name) {}
	connect() {}
	close() {}
}

module.exports = Database;
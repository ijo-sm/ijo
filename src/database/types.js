class DatabaseTypes {
	constructor() {
		this.types = [];
	}

	register(name, databaseClass) {
		this.types.push({
			name, databaseClass
		});
	}

	unregister(name) {
		const typeIndex = this.types.findIndex(type => type.name === name);

		if(typeIndex < 0) return;

		this.types.splice(typeIndex);
	}

	getDatabaseClass(name) {
		const type = this.types.find(type => type.name === name);

		if(!type) return;

		return type.databaseClass;
	}

	getDatabase(databaseConfig, {root} = {}) {
		if(databaseConfig === undefined) throw Error("There is no configuration for the database.");

		const databaseClass = this.getDatabaseClass(databaseConfig.type);

		if(databaseClass === undefined) throw Error("Database type specified in config doesn't exist.");

		return new (databaseClass)(databaseConfig, {root});
	}
}

module.exports = DatabaseTypes;
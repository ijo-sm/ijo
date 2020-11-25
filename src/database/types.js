/**
 * The DatabaseTypes class manages the available database implementations. Plugins are free to register their own 
 * implementations which a user may then select, keeping IJO open to modularity.
 */
class DatabaseTypes {
	/**
	 * Assign an array to the instance containing the registered types.
	 */
	constructor() {
		this.types = [];
	}

	/**
	 * Registers a new database type given the specified name and which will, if chosen by the user, create an instance
	 * of the supplied database class.
	 */
	register(name, databaseClass) {
		this.types.push({
			name, databaseClass
		});
	}

	/**
	 * Unregisters the database implementation with the specified name.
	 */
	unregister(name) {
		const typeIndex = this.types.findIndex(type => type.name === name);

		if(typeIndex < 0) return;

		this.types.splice(typeIndex);
	}

	/**
	 * Returns the database class for the implementation with the given name.
	 */
	getDatabaseClass(name) {
		const type = this.types.find(type => type.name === name);

		if(!type) return;

		return type.databaseClass;
	}

	/**
	 * Returns a newly created instance of the database class that matches the specification of the supplied 
	 * configuration. It also passes on some non-user specified arguments.
	 * TODO: Move this function?
	 */
	getDatabase(databaseConfig, {root} = {}) {
		if(databaseConfig === undefined) throw Error("There is no configuration for the database.");

		const databaseClass = this.getDatabaseClass(databaseConfig.type);

		if(databaseClass === undefined) throw Error("Database type specified in config doesn't exist.");

		return new (databaseClass)(databaseConfig, {root});
	}
}

module.exports = DatabaseTypes;
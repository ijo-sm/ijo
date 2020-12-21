/**
 * The DatabaseTypes class manages the available database implementations. Plugins are free to register their own 
 * implementations which a user may then select, keeping IJO open to modularity.
 * @memberof database
 */
class DatabaseTypes {
    /**
     * Assign an array to the instance containing the registered types.
     */
    constructor() {
        /**
         * The array of registerd database types.
         * @type {Array.<Object>}
         */
        this.types = [];
    }

    /**
     * Registers a new database type given the specified name and which will, if chosen by the user, create an instance
     * of the supplied database class.
     * @param {String} name The name of the database type.
     * @param {Class} databaseClass The class for the database.
     */
    register(name, databaseClass) {
        this.types.push({
            name, databaseClass
        });
    }

    /**
     * Unregisters the database implementation with the specified name.
     * @param {String} name The name of the database type.
     */
    unregister(name) {
        const typeIndex = this.types.findIndex(type => type.name === name);

        if (typeIndex < 0) return;

        this.types.splice(typeIndex);
    }

    /**
     * Returns the database class for the implementation with the given name.
     * @param {String} name The name of the database type.
     * @returns {Class} The matching database class.
     */
    getDatabaseClass(name) {
        const type = this.types.find(type => type.name === name);

        if (!type) return;

        return type.databaseClass;
    }

    /**
     * Returns a newly created instance of the database class that matches the specification of the supplied 
     * configuration. It also passes on some non-user specified arguments.
     * TODO: Move this function?
     * @param {Object} databaseConfig The configuration for the database.
     * @param {Object} options The options for getting the database.
     * @param {String} options.root The root of ijo.
     * @returns {Database} The created database.
     */
    getDatabase(databaseConfig, {root} = {}) {
        if (databaseConfig === undefined) throw Error("There is no configuration for the database.");

        const databaseClass = this.getDatabaseClass(databaseConfig.type);

        if (databaseClass === undefined) throw Error("Database type specified in config doesn't exist.");

        return new (databaseClass)(databaseConfig, {root});
    }
}

module.exports = DatabaseTypes;
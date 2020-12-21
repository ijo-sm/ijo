const Model = require("../database/model");

/**
 * This is the model for a daemon.
 * @memberof daemon
 */
class DaemonModel extends Model {
    /**
     * Constructs this daemon from the given data object.
     * @param {Object} data The given daemon data.
     * @param {String} data.name The name of the daemon.
     * @param {String} data.key The key of the daemon.
     */
    constructor({name, key}) {
        super();

        this.name = name;
        this.key = key;
    }

    /**
     * Checks if the specified key is equal to this daemon's key.
     * @param {String} key The key to check to.
     * @returns {Boolean} If the keys match.
     */
    isEqualKey(key) {
        return this.key === key;
    }

    /**
     * Reconstructs this daemon as an object and returns that object.
     */
    toObject() {
        super.toObject();

        return {
            name: this.name,
            key: this.key
        }
    }
}

module.exports = DaemonModel;
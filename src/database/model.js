/**
 * This is the model that is used by the database. It lays out the basics of what a model, representing an item in a 
 * database, must be able to do.
 * @abstract
 * @memberof database
 */
class Model {
    /**
     * Constructs the model from the given data.
     * @param {Object} data The data for the model.
     */
    constructor() {}

    /**
     * Constructs and returns an object from this model.
     * @returns {Object} The constructed object.
     */
    toObject() {}
}

module.exports = Model;
const Model = require("./model");

/**
 * This is the abstract Collection class. Databasing implementations have to create a class extending this one, as this 
 * class contains all the required functions for a collection. The code for IJO and its plugins will only call these 
 * functions to create a uniform api.
 * @memberof database
 */
class Collection {
	/**
	 * A collection has a name and a class which instances represent the model for the class. The supplied variables 
	 * are immediately added to the collection instance for implementations of this class to use.
	 * @param {String} name The name of the collection.
	 * @param {Class} modelClass The class of the model for this collection. 
	 */
	constructor(name, modelClass) {
		this.name = name;
		this.modelClass = modelClass;
	}

	/**
	 * Finds the items in this collection that match the specified query. This function is expected to be async.
	 * @param {Object} query The query to search for.
	 * @returns {Promise<Model[]>} A promise that is resolved with the found items.
	 */
	find(query) {}

	/**
	 * Returns the first found item in this collection that matches the specified query. This function is expected to 
	 * be async.
	 * @param {Object} query The query to search for.
	 * @returns {Promise<Model>} A promise that is resolved with the found item.
	 */
	findOne(query) {}

	/**
	 * Adds the specified array of items to this collection. This function is expected to be async.
	 * @param {Array<Model>} items The items to add to the collection.
	 * @returns {Promise} A promise that is resolved when the items have been added.
	 */
	add(items) {}

	/**
	 * Adds a single specified item to this collection. This function is expected to be async.
	 * @param {Model} item The item to add to the collection.
	 * @returns {Promise} A promise that is resolved when the item has been added.
	 */
	addOne(item) {}

	/**
	 * Removes all items matching the specified query from this collection. This function is expected to be async.
	 * @param {Object} query The query of items to remove.
	 * @returns {Promise} A promise that is resolved when the items have been removed.
	 */
	remove(query) {}

	/**
	 * Removes the first found item from this collection that matches the specified query. This function is expected to 
	 * be async.
	 * @param {Object} query The query of the item to remove.
	 * @returns {Promise} A promise that is resolved when the item has been removed.
	 */
	removeOne(query) {}

	/**
	 * Replaces all items in this collection that match the specified query with the specified item. This function is 
	 * expected to be async.
	 * @param {Object} query The query of items to update.
	 * @param {Model} item The item to update the found items with.
	 * @returns {Promise} A promise that is resolved when the items have been updated.
	 */
	update(query, item) {}
	
	/**
	 * Replaces the first found item from this collection that matches the specified query with the specified item. 
	 * This function is expected to be async.
	 * @param {Object} query The query of the item to remove.
	 * @param {Model} item The item to update the found item with.
	 * @returns {Promise} A promise that is resolved when the item has been updated.
	 */
	updateOne(query, item) {}
}

module.exports = Collection;
/**
 * This is the abstract Collection class. Databasing implementations have to create a class extending this one, as this 
 * class contains all the required functions for a collection. The code for IJO and its plugins will only call these 
 * functions to create a uniform api.
 */
class Collection {
	/**
	 * A collection has a name and a class which instances represent the model for the class. The supplied variables 
	 * are immediately added to the collection instance for implementations of this class to use.
	 */
	constructor(name, modelClass) {
		this.name = name;
		this.modelClass = modelClass;
	}

	/**
	 * Finds the items in this collection that match the specified query. This function is expected to be async.
	 */
	find(query) {}

	/**
	 * Returns the first found item in this collection that matches the specified query. This function is expected to 
	 * be async.
	 */
	findOne(query) {}

	/**
	 * Adds the specified array of items to this collection. This function is expected to be async.
	 */
	add(items) {}

	/**
	 * Adds a single specified item to this collection. This function is expected to be async.
	 */
	addOne(item) {}

	/**
	 * Removes all items matching the specified query from this collection. This function is expected to be async.
	 */
	remove(query) {}

	/**
	 * Removes the first found item from this collection that matches the specified query. This function is expected to 
	 * be async.
	 */
	removeOne(query) {}

	/**
	 * Replaces all items in this collection that match the specified query with the specified item. This function is 
	 * expected to be async.
	 */
	update(query, item) {}
	
	/**
	 * Replaces the first found item from this collection that matches the specified query with the specified item. 
	 * This function is expected to be async.
	 */
	updateOne(query, item) {}
}

module.exports = Collection;
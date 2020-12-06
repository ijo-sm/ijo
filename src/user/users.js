const Database = require("../database/database");
const Api = require("../net/api");
const UserApi = require("./userApi");
const UserModel = require("./userModel");

/**
 * This class manages some basic user functionality. 
 */
class Users {
    /**
     * Initializes the class with some parts from IJO's core. It registers the users collection and creates the user 
     * api.
     * @param {Object} parts The parts from IJO's core.
     * @param {Database} database The database for IJO.
     * @param {Api} api The api for IJO.
     */
    initialize({database, api} = {}) {
        database.register("users", UserModel);
        this.api = new UserApi(api, this);
    }

    /**
     * Loads the user collection.
     * @param {Object} parts The parts from IJO's core.
     * @param {Database} database The database for IJO.
     */
    load({database} = {}) {
        this.collection = database.collection("users");
    }

    /**
     * Creates and returns a new user with the given options.
     * @param {Object} options The options for the user. 
     * @param {String} options.username The username of the user.
     * @param {String} options.password The plaintext password of the user.
     * @returns {UserModel} The newly created user.
     */
    create({username, password} = {}) {
        const user = new UserModel({username});
        user.setPassword(password);

        return user;
    }
}

module.exports = Users;
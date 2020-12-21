const UserApi = require("./api");
const UserModel = require("./model");
const UserAuth = require("./auth/manager");
const {nanoid} = require("nanoid");

/**
 * This class manages some basic user functionality. 
 * @memberof user
 */
class Users {
    constructor() {
        this.auth = new UserAuth();
    }

    /**
     * Initializes the class with some parts from IJO's core. It registers the users collection and creates the user 
     * api.
     * @param {Object} parts The parts from IJO's core.
     * @param {Database} parts.database The database for IJO.
     * @param {ApiServer} parts.apiServer The api for IJO.
     */
    initialize({database, apiServer} = {}, {auth} = {}) {
        database.register("users", UserModel);
        this.api = new UserApi(apiServer, this);
        this.auth.initialize({auth});
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
        const id = nanoid(16);
        const user = new UserModel({id, username});
        user.setPassword(password);

        return user;
    }

    /**
     * Verifies the user from the token sent with this request and returns the id of that user.
     * @param {ApiRequest} req The api request.
     * @param {ApiResponse} res The api response.
     * @returns {String} The id of the user in the token.
     */
    async verifyUser(req, res) {
        const token = req.getBearerToken();

        if (token === undefined) {
            res.sendError({message: "The user token is missing.", code: 400});
            
            return;
        }

        return new Promise(resolve => {
            this.auth.verifyToken(token)
            .catch(err => {
                if (err === "token-expired") {
                    res.sendError({message: "The user token has expired.", code: 400});
                }
                else if (err === "incorrect-token") {
                    res.sendError({message: "The user token was incorrect.", code: 400});
                }
                else {
                    res.sendError({message: "An unexpected error occurred while verifying the user token", code: 500});
                }

                resolve();
            })
            .then(userid => resolve(userid));
        });
    }
}

module.exports = Users;
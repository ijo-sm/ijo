const ApiModel = require("../net/apiModel");

class UserApi extends ApiModel {
    constructor(api, users) {
        super(api);

        api.register("/user/create", "POST", (...args) => this.create(users, ...args));
    }

    /**
     * Creates a new user.
     * @param {Users} users The users class.
     * @param {ApiRequest} req The api request.
     * @param {ApiResponse} res The api response.
     */
    async create(users, req, res) {
        const data = await req.bodyAsJSON();
        // TODO: Check if username has already been used.
        // TODO: Check if data is correct (eg username and password are not missing).
        const user = users.create({username: data.username, password: data.password});
        await users.collection.addOne(user).catch(e => res.sendError({message: e.message, code: 500}));

        res.send({data: {message: "Created"}, code: 201});
    }
}

module.exports = UserApi;
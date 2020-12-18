const ApiModel = require("../net/api/model");

class UserApi extends ApiModel {
    constructor(apiServer, users) {
        super(apiServer);

        apiServer.register("/user/create", "POST", (...args) => this.create(users, ...args));
    }

    /**
     * Creates a new user.
     * @param {Users} users The users class.
     * @param {ApiRequest} req The api request.
     * @param {ApiResponse} res The api response.
     */
    async create(users, req, res) {
        const data = await req.bodyAsJSON();
        
        // Validate incoming data
        if (
            !await req.isValidKey(res, "username", "string") ||
            !await req.isValidKey(res, "password", "string")
        ) {return}

        // TODO: Check if username has already been used.

        const user = users.create({username: data.username, password: data.password});
        await users.collection.addOne(user).catch(e => res.sendError({message: e.message, code: 500}));

        res.send({data: {message: "Created"}, code: 201});
    }
}

module.exports = UserApi;

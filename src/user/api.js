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
        if (!data?.username) {res.sendError({message: "Missing required data 'username'", code: 500});return}
        if (!data?.password) {res.sendError({message: "Missing required data 'password'", code: 500});return}
        if (typeof(data?.username) != "string") {
            res.sendError({message: "Invalid Data: 'username' was invalid type", code: 500});
            return;
        }
        if (typeof(data.password) != "string") {
            res.sendError({message: "Invalid Data: 'password' was invalid type", code: 500});
            return;
        }

        // TODO: Check if username has already been used.

        const user = users.create({username: data.username, password: data.password});
        await users.collection.addOne(user).catch(e => res.sendError({message: e.message, code: 500}));

        res.send({data: {message: "Created"}, code: 201});
    }
}

module.exports = UserApi;

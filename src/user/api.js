const ApiModel = require("../net/api/model");

class UserApi extends ApiModel {
    constructor(apiServer, users) {
        super(apiServer);

        apiServer.register("/user/create", "POST", (...args) => this.create(users, ...args));
        apiServer.register("/user/login", "POST", (...args) => this.login(users, ...args));
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

    /**
     * Logs the user in by creating and sending a new token.
     * @param {Users} users The users class.
     * @param {ApiRequest} req The api request.
     * @param {ApiResponse} res The api response.
     */
    async login(users, req, res) {
        const data = await req.bodyAsJSON();
        const user = await users.collection.findOne({username: data.username});

        if(user === undefined || !user.isEqualPassword(data.password)) {
            res.sendError({message: "The username and/or password is incorrect.", code: 400});
        }

        const token = await users.auth.createToken(user.id);

        res.send({data: {message: "Logged in", token}});
    }
}

module.exports = UserApi;

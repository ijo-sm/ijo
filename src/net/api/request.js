const {IncomingMessage} = require("http");
const UserAuth = require("../../user/auth/manager");
const ApiResponse = require("./response");

/**
 * This is a custom api request class, extending the capabilities of an IncomingMessage.
 */
class ApiRequest {
    /**
     * Sets the internal value for the IncomingMessage.
     * @param {IncomingMessage} req The IncomingMessage for this request.
     */
    constructor(req) {
        this.req = req;
    }

    /**
     * Returns the body of the IncomingMessage as an object asynchronously.
     * @returns {Promise<Object>} A promise that is resolved when the body is loaded and parsed to an object.
     */
    async bodyAsJSON() {
        try {
            return JSON.parse(await this.body().catch(e => {throw e}));
        } catch {
            return {};
        }
    }

    /**
     * Returns the token that is in the Authorization header and is of type Bearer.
     * @returns {String} The bearer authorization credentials. 
     */
    getBearerToken() {
        let authorization = this.req.headers["authorization"];

        if(authorization === undefined) return;

        authorization = authorization.split(" ");

        if(authorization[0] !== "Bearer") return;

        return authorization[1];
    }

    /**
     * Verifies the user from the token sent with this request and returns the id of that user.
     * @param {UserAuth} auth The user authentication class.
     * @param {ApiResponse} res The api response.
     * @returns {String} The id of the user in the token.
     */
    async verifyUser(auth, res) {
        const token = this.getBearerToken();

        if(token === undefined) {
            res.sendError({message: "The user token is missing.", code: 400});
            return;
        }

        return new Promise(resolve => {
            auth.verifyToken(token)
            .catch(err => {
                if(err === "token-expired") {
                    res.sendError({message: "The user token has expired.", code: 400});
                }
                else if(err === "incorrect-token") {
                    res.sendError({message: "The user token was incorrect.", code: 400});
                }
                else {
                    res.sendError({message: "An unexpected error occurred while verifying the user token", code: 500});
                }
            })
            .then(token => resolve(token));
        });
    }

    /**
     * Returns the body of the IncomingMessage as a Buffer asynchronously. Because the body can only be loaded once it 
     * is cached when it has been loaded the first time.
     * @return {Promise<Buffer>} A promise that resolves with the body as Buffer when it is loaded.
     */
    async body() {
        if(this.bodyData) return this.bodyData;

        return this.bodyData = await new Promise(resolve => {
            let data = Buffer.from([]);
            this.req.on("data", chunk => data = Buffer.concat([data, chunk]));
            this.req.on("end", () => resolve(data));
        }).catch(e => {throw e});
    }
}

module.exports = ApiRequest;
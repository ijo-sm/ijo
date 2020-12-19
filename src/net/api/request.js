const {IncomingMessage} = require("http");
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
        if (this.bodyJSON) return this.bodyJSON
        try {
            this.bodyJSON = JSON.parse(await this.body().catch(e => {throw e}));
        } catch {
            this.bodyJSON = {};
        }
        return this.bodyJSON;
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
    
    /**
     * Test if a given key is valid. 
     * 
     * Return true if the key is valid and matches the type given, otherwise returns false
     * @param {ApiResponse} res The response object
     * @param {string} key The key to validate
     * @param {string} type The expected type of the key (optional)
     */
    async isValidKey(res, key, type=undefined) {
        const body = await this.bodyAsJSON();
        if (body && body[key] != undefined) {
            if (typeof(body[key]) == type || type == undefined) {
                return true;
            }
            res.sendError({
                message: `Invalid Data: '${key}' is of incorrect type; expected '${type}', received '${typeof(body[key])}'`,
                code: 400
            });
        }
        res.sendError({message: `Missing required key: '${key}'`, code: 400});
    }
}

module.exports = ApiRequest;

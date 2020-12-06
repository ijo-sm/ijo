const {IncomingMessage} = require("http");

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
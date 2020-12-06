const ApiServer = require("./apiServer");

/**
 * This is the standard model for classes that extend the api.
 */
class ApiModel {
    /**
     * On construction the api is passed to the class to registers new paths to the stack.
     * @param {ApiServer} api The api handler. 
     */
    constructor(apiServer) {}
}

module.exports = ApiModel;
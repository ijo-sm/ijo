const Api = require("./api");

/**
 * This is the standard model for classes that extend the api.
 */
class ApiModel {
    /**
     * On construction the api is passed to the class to registers new paths to the stack.
     * @param {Api} api The api handler. 
     */
    constructor(api) {}
}

module.exports = ApiModel;
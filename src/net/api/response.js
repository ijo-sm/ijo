const {ServerResponse} = require("http");

/**
 * This is a custom api response class, extending the capabilities of an ServerResponse.
 */
class ApiResponse {
    /**
     * Sets the internal value for the ServerResponse.
     * @param {ServerResponse} res The ServerResponse for this request.
     */
    constructor(res) {
        this.res = res;
    }

    /**
     * Returns the name of the given HTTP status code.
     * @param {Number} code The status code.
     * @returns {String} The name of the status code.
     */
    statusCodeToName(code) {
        return {
            200: "OK",
            201: "Created",
            202: "Accepted",
            204: "No Content",
            301: "Moved Permanently",
            302: "Found",
            304: "Not Modified",
            307: "Temporary Redirect",
            308: "Permanent Redirect",
            400: "Bad Request",
            401: "Unauthorized",
            402: "Payment Required",
            403: "Forbidden",
            404: "Not Found",
            405: "Method Not Allowed",
            406: "Not Acceptable",
            408: "Request Timeout",
            409: "Conflict",
            410: "Gone",
            429: "Too Many Request",
            500: "Internal Server Error",
            501: "Not Implemented",
            502: "Bad Gateway",
            503: "Service Unavailable",
            504: "Gateway Timeout"
        }[code];
    }

    /**
     * Sends an error with the specified options. A message, preferably the reason for the error, can be set using the 
     * message option. The code of the error using the code option. Remaining data can be sent using the data option.
     * A name for the error type can be set using the name option. By default this is set to the name matching the set
     * status code. Using this method ends the response.
     * @param {Object} options The options for this error response.
     * @param {String} options.message The message to explain the error.
     * @param {Number} options.code The error status code.
     * @param {Object} options.data The data to go with the error.
     * @param {String} options.name The name of the error (matches the status code by default).
     */
    sendError({message, code = 400, data, name} = {}) {
        this.send({data: {
            name: name ? name : this.statusCodeToName(code),
            message,
            code,
            data
        }, code});
    }

    /**
     * Sends a response with the specified options to end the request. Data can be sent using the data option and the 
     * status code is set using the code option.
     * @param {Object} options The options for this response.
     * @param {Object} options.data The data for the response.
     * @param {Number} options.code The status code.
     */
    send({data = {}, code = 200} = {}) {
        this.res.statusCode = code;
        this.res.end(JSON.stringify(data));
    }
}

module.exports = ApiResponse;
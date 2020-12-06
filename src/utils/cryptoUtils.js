const crypto = require("crypto");

/**
 * Hashes the given text using the given algorithm and returns it in the specified encoding.
 * @param {String} text The text to hash.
 * @param {String} algorithm The algorithm to hash using.
 * @param {String} encoding The encoding to return.
 * @returns {String} The hashed text.
 */
const hash = (text, algorithm = "sha256", encoding = "hex") => {
    return crypto.createHash(algorithm).update(text).digest(encoding);
}

module.exports = {
    hash
};
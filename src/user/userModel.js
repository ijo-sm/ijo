const CryptoUtils = require("../utils/cryptoUtils");
const Model = require("../database/model");

/**
 * This is the model for a user.
 */
class UserModel extends Model {
    /**
     * Constructs this user from the given data object.
     * @param {Object} data The given user data.
     * @param {String} username The username of the user.
     * @param {String} password The hashed password of the user.
     */
    constructor({username, password}) {
        super();

        this.username = username;
        this.password = password;
    }

    /**
     * Changes this user's password to the given plain text password. The password is first hashed before being used.
     * @param {String} plain The plaintext password.
     */
    setPassword(plain) {
        this.password = CryptoUtils.hash(plain);
    }

    /**
     * Checks if the given plaintext password is equal to the password of this user. This is checked by first hashing
     * the given plaintext password before comparing.
     * @param {String} plain The plaintext password.
     * @returns {Boolean} If the given plaintext password is equal to this user's password.
     */
    isEqualPassword(plain) {
        const hashedPassword = CryptoUtils.hash(plain);

        return this.password === hashedPassword;
    }

    /**
     * Reconstructs this user as an object and returns that object.
     */
    toObject() {
        return {
            username: this.username,
            password: this.password
        };
    }
}

module.exports = UserModel;
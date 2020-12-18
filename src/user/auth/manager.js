const jwt = require("jsonwebtoken");

class Auth {
    initialize({auth} = {}) {
        this.secret = auth.secret;
        this.expiresIn = auth.expiresIn;
    }

    verifyToken(token, userid) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secret, (err, decoded) => {
                if(err) {
                    if(err.name === "TokenExpiredError") resolve("token-expired");
                    else if(err.name === "JsonWebTokenError") resolve("incorrect-token");
                    else reject(err);
                }
                else if(decoded.user !== userid) resolve("incorrect-user");
                else resolve("correct");
            });
        });
    }

    createToken(userid) {
        return new Promise((resolve, reject) => {
            jwt.sign({
                user: userid
            }, this.secret, {
                expiresIn: this.expiresIn
            }, (err, token) => {
                if(err) reject(err);
                else resolve(token);
            });
        });
    }
}

module.exports = Auth;
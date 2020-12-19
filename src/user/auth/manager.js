const jwt = require("jsonwebtoken");

class UserAuth {
    initialize({auth} = {}) {
        this.secret = auth.secret;
        this.expiresIn = auth.expiresIn;
    }

    verifyToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secret, (err, decoded) => {
                if(err) {
                    if(err.name === "TokenExpiredError") reject("token-expired");
                    else if(err.name === "JsonWebTokenError") reject("incorrect-token");
                    else reject(err);
                }
                else resolve(decoded.user);
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

module.exports = UserAuth;
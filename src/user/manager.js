function hashPassword(str) {
	let hash = require("crypto").createHash("sha256");
	hash.update(str);
	return hash.digest("hex");
}

module.exports = class UserManager {
	constructor() {}

	create(username, password) {
		let id = require("shortid").generate();

		return app.db.users.get("users").push({
			id, username, password
		}).write();
	}

	getUser(key, value) {
		return app.db.users.get("users").find(user => user[key] === value).value();
	}

	checkPassword(username, password) {
		let user = this.getUser("username", username);

		if(user === undefined) {
			return false;
		}

		return user.password === hashPassword(password);
	}
}
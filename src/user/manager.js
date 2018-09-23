function hashPassword(str) {
	let hash = require("crypto").createHash("sha256");
	hash.update(str);
	return hash.digest("hex");
}

class User {
	constructor(id, username, password) {
		this.id = id;
		this.username = username;
		this.password = password;
	}

	checkPassword(password) {
		return this.password === hashPassword(password);
	}
}

module.exports = class UserManager {
	constructor() {}

	create(username, password) {
		let id = require("shortid").generate();

		return app.db.get("users").push({
			id, username, password
		}).write();
	}

	getUser(key, value) {
		var user = app.db.get("users").find(user => user[key] === value).value();

		if(user === undefined) {
			return undefined;
		}

		return new User(user.id, user.username, user.password);
	}
}
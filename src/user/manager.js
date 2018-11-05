const Utils = include("@ijo-sm/utils");
const database = include("src/database/database");

class User {
	constructor(object) {
		this.id = object.id;
		this.username = object.username;
		this.password = object.password;
	}

	checkPassword(password) {
		return this.password === Utils.crypto.hash(password);
	}
}

class UserManager {
	initialize() {
		database.create("users");
	}

	create(username, password) {
		let id = Utils.generate.shortid();

		return database.get("users").push({
			id, username, password
		}).write();
	}

	getUser(key, value) {
		let user = database.get("users").find(user => user[key] === value).value();

		if(user === undefined) {
			return undefined;
		}

		return new User(user);
	}
}

module.exports = new UserManager();
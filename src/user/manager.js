class User {
	constructor(object) {
		this.id = object.id;
		this.username = object.username;
		this.password = object.password;
	}

	checkPassword(password) {
		return this.password === ijo.utils.crypto.hash(password);
	}
}

module.exports = class UserManager {
	initialize() {
		ijo.db.create("users");
	}

	create(username, password) {
		let id = ijo.utils.generate.shortid();

		return ijo.db.get("users").push({
			id, username, password
		}).write();
	}

	getUser(key, value) {
		let user = ijo.db.get("users").find(user => user[key] === value).value();

		if(user === undefined) {
			return undefined;
		}

		return new User(user);
	}
}
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

module.exports = class UserManager {
	initialize() {
		app.db.create("users");
	}

	create(username, password) {
		let id = Utils.generate.shortid();

		return app.db.get("users").push({
			id, username, password
		}).write();
	}

	getUser(key, value) {
		let user = app.db.get("users").find(user => user[key] === value).value();

		if(user === undefined) {
			return undefined;
		}

		return new User(user);
	}
}
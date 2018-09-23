function generateUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);

		return v.toString(16);
	});
}

module.exports = class SessionManager {
	constructor() {
		this.sessions = [];
	}

	init() {
		setInterval(function() {
			this.update();
		}.bind(this), app.globalConfig.get("server.sessions.updateInterval"));
	}

	get(cookie) {
		let session;

		if(cookie === undefined || cookie.value === undefined || this.sessions.findIndex(item => item.id === cookie.value) === -1) {
			session = this.generate();
			this.sessions.push(session);
		}
		else {
			session = this.sessions.find(item => item.id === cookie.value);
		}

		return session;
	}

	update() {
		let date = new Date().getDate();

		for(let i = 0; i < this.sessions.length; i++) {
			if(date - this.sessions[i].date > app.globalConfig.get("server.sessions.expireTime")) {
				this.sessions.splice(i, 1);
			}
		}
	}

	generate() {
		let id = generateUUID();

		if(this.sessions.map(item => item.id).includes(id)) {
			return this.generate();
		}

		return {
			id, 
			data: {}, 
			date: new Date().getDate()
		};
	}
}

module.exports = class SessionManager {
	constructor() {
		this.sessions = [];
	}

	start() {
		this.interval = setInterval(function() {
			this.update();
		}.bind(this), app.globalConfig.get("server.sessions.updateInterval"));
	}

	stop() {
		clearInterval(this.interval);
	}

	get(cookie) {
		let session;

		if(!this.has(cookie)) {
			session = this.generate();
			this.sessions.push(session);
		}
		else {
			session = this.sessions.find(item => item.id === cookie.value);
		}

		return session;
	}

	has(cookie) {
		if(cookie === undefined || cookie.value === undefined) {
			return false;
		}

		return this.sessions.findIndex(item => item.id === cookie.value) > -1;
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
		let id = Utils.generate.uuid();

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

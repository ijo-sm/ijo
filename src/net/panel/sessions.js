module.exports = class SessionManager {
	constructor() {
		this.sessions = [];
	}

	init(settings) {
		this.settings = settings;

		setInterval(function() {
			this.update();
		}.bind(this), this.settings.updateInterval);
	}

	get(id) {
		let session;

		if(id === undefined || this.sessions.findIndex(item => item.id === id) === -1) {
			session = this.generate();
			this.sessions.push(session);
		}
		else {
			session = this.sessions.find(item => item.id === id);
		}

		return session;
	}

	update() {
		let date = new Date().getDate();

		for(let i = 0; i < this.sessions.length; i++) {
			if(date - this.sessions[i].date > this.settings.expireTime) {
				this.settings.splice(i, 1);
			}
		}
	}

	generate() {
		let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);

			return v.toString(16);
		});

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

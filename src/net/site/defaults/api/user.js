const JSONResponse = require("../../json");

module.exports = class UserAPI {
	login(req, res) {
		let jsonResponse = new JSONResponse(req, res);

		req.getBody()
		.then(function(body) {
			if(req.session.data.userID) {
				return jsonResponse.error(403, "User is already logged in.");
			}

			try {
				body = JSON.parse(body);
			}
			catch(e) {
				return jsonResponse.error(400, "The request body could not be parsed.");
			}

			let user = ijo.users.getUser("username", body.username);

			if(user === undefined || !user.checkPassword(body.password)) {
				return jsonResponse.error(400, "The username and/or password are incorrect.");
			}
	
			res.end(JSON.stringify({code: 200, title: "Success", userID: req.session.data.userID = user.id}));
		});
	}
}
$("#submit").click(function() {
	$.post({
		url: "/api/login",
		data: JSON.stringify({
			username: $("#username").val(),
			password: $("#password").val()
		}),
		complete: function(xhr) {
			var data = xhr.responseText;

			try {
				data = JSON.parse(data);
			} catch(e) {
				data = {};
			}

			if(data.code === undefined || data.code !== 200) {
				return alert("Somethings went wrong while logging in: " + data.reason);
			}

			console.log(data.userID);
	
			window.location.href = "/";
		}
	});
	
});
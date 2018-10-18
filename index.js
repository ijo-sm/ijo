global.Utils = require("./src/utils/utils");
global.app = new (require("./src/app"))();
app.start()
.then(function() {
	console.log("IJO has started.");
});

process.on("exit", function() {
	app.stop();
});
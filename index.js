global.Utils = require("./src/utils/utils");
global.app = new (require("./src/app"))();
app.start()
.then(() => {
	console.log("IJO Panel has started.");
})
});

process.on("exit", function() {
	app.stop();
});
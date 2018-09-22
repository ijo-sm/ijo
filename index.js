global.app = new (require("./src/app"))();
app.start();

process.on("exit", function() {
	app.stop();
});
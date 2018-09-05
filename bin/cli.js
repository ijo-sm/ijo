#!/usr/bin/env node
var args = process.argv;
var app;
args.splice(0, 2)

if(args[0] === "start") {
	app = new (require("../src/app"))();
	app.start()
	.then(function() {
		console.log("IJO has started.");
	});
}
else if(args[0] === "stop") {
	if(app !== undefined && app.listening) {
		app.stop();
		app = undefined;

		console.log("IJO has been stopped.");
	}
	else {
		console.log("IJO has not even started yet.");
	}
}
else {

}
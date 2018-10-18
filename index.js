global.Utils = require("./src/utils/utils");
global.app = new (require("./src/app"))();
app.start()
.then(() => {
	console.log("IJO Panel has started.");
})
.catch((error) => {
    console.log(`Startup has failed${error instanceof Error ? `: ${error.message}\n${error.stack}` : ""}`);

    process.exit(1);
});

Utils.process.onExit(end => {
    app.stop()
    .then(() => {
        end();
    });
});
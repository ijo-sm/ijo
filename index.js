global.include = (path) => {
    if(path.startsWith("src/")) {
        return require("./" + path);
    }

    return require(path);
}

const Utils = include("@ijo-sm/utils");

let ijo = new (require("./src/app"))();
ijo.start()
.then(() => {
	console.log("IJO Panel has started.");
})
.catch((error) => {
    console.log(`Startup has failed${error instanceof Error ? `: ${error.message}\n${error.stack}` : ""}`);

    process.exit(1);
});

Utils.process.onExit(end => {
    ijo.stop()
    .then(() => {
        end();
    });
});
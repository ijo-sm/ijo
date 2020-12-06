const Core = require("./core");
const core = new Core();
core.initialize()
.then(() => {
	return core.start();
})
.then(() => {
	console.log("IJO's core has started.");
})
.catch(err => {
	throw err;
});

const stop = event => {
	return core.stop()
	.then(() => {
		console.log(`IJO's core has stopped (event: ${event})`);
	})
	.catch(err => {
		throw err;
	})
};

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach(event => {
    process.on(event, stop.bind(null, event));
});
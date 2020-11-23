const Core = require("./core");
const core = new Core();
core.initialize()
.then(() => {
	return core.start();
})
.then(() => {
	console.log("The core has started.");
})
.catch(err => {
	throw err;
});


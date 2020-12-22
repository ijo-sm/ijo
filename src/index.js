const Core = require("./core");
const core = new Core();
core.initialize()
.then(() => {
    return core.start();
})
.catch(err => {
    throw err;
});

let stopped = false;
const stop = (event, err) => {
    if (err && err instanceof Error) console.error(err);
    if (stopped) return;
    stopped = true;

    return core.stop(event)
    .catch(err => {
        throw err;
    });
};

["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "SIGTERM", "uncaughtException"].forEach(event => {
    process.on(event, err => stop(event, err));
});

/** @namespace daemon */
/** @namespace database */
/** @namespace net */
/** @namespace plugin */
/** @namespace user */
/**
 * This is the authentication class, that authenticates daemons and is in charge of adding new(/pending) daemons.
 * @memberof daemon
 */
class DaemonAuth {
    constructor() {
        /**
         * An array of daemon handlers that are still pending, meaning they haven't been added to the panel yet.
         * @type {Array.<DaemonHander>}
         */
        this.pending = [];
    }

    /**
     * Initializes the daemon authentication manager.
     * @param {Object} parts The parts that auth needs to function.
     * @param {Daemons} parts.daemons The daemon manager.
     */
    initialize({daemons}) {
        this.daemons = daemons;
    }

    /**
     * Starts the authentication process for the given daemon handler. First a timeout check is created to close 
     * handlers that take too long to identify. Then the method will wait until the daemon idenitfies itself. If the
     * daemon is already known it will authenticate, if not it will add the handler to list of pending handlers.
     * @param {DaemonHandler} handler The daemon handler.
     * @returns {Promise} A promise that is resolved when the authentication process has finished.
     */
    async authenticate(handler) {
        let timedOut = false;

        setTimeout(() => {
            if (handler.pending || handler.isIdentified) return;
            timedOut = true;
            handler.close();
        }, 3000);

        const identity = await new Promise(resolve => {
            handler.identifyCallback = data => resolve(data);
        });

        if (timedOut) return;

        handler.identity = identity;

        const daemon = await this.daemons.collection.findOne({name: handler.identity.name});

        if (daemon) this.authKnown(handler, daemon);
        else await this.authUnknown(handler);
    }

    /**
     * Adds an as of yet unknown daemon to the list of pending daemons. It will send an error to the daemon if: the 
     * name is already in use, there is no name given by the daemon or when there is no code supplied in the daemon's 
     * identity.
     * @param {DaemonHandler} handler The daemon handler.
     * @returns {Promise} A promise that resolves when the authentication is finished.
     */
    async authUnknown(handler) {
        if (typeof(handler.identity.name) !== "string") {
            return handler.send({event: "auth/incorrect"});
        }
        if (typeof(handler.identity.code) !== "string") {
            return handler.send({event: "auth/incorrect"});
        }
        if (await this.daemons.isNameUsed(handler.identity.name)) {
            return handler.send({event: "nameInUse"});
        }

        this.addPending(handler);
    }

    /**
     * Authenticates if the handler truly represents the daemon it says it is using its key. If the key is incorrect an
     * error is sent to the daemon. If the authentication is successful this is sent to the daemon. The handler class 
     * is added to the list of connections.
     * @param {DaemonHandler} handler The daemon handler.
     * @param {DaemonModel} daemon The daemon that corresponds to the name given by the handler.
     */
    authKnown(handler, daemon) {
        if (!daemon.isEqualKey(handler.identity.key)) {
            return handler.send({event: "auth/incorrect"});
        }

        handler.send({event: "auth/correct"});
        handler.identified(daemon);
        this.daemons.addConnection(handler);
    }

    /**
     * Adds the specified handler to the list of pending handlers. It also sets pending to true for the handler.
     * @param {DaemonHandler} handler The daemon handler.
     */
    addPending(handler) {
        handler.pending = true;
        this.pending.push(handler);
    }

    /**
     * Removes the specified handler from the list of pending handlers. It also sets pending to false for the handler.
     * @param {DaemonHandler} handler The daemon handler.
     */
    removePending(handler) {
        const handlerIndex = this.pending.find(pendingHandler => pendingHandler === handler);

        if (handlerIndex < 0) return;

        this.pending.splice(handlerIndex);
        handler.pending = false;
    }

    /**
     * Transfers a pending handler into a newly created daemon model. This model is added to the database and the 
     * handler to the list of connected daemons. Lastly, it sends the key of the new of the daemon to the daemon.
     * @param {DaemonHandler} handler The daemon handler.
     */
    async pendingToConnection(handler) {
        const daemon = this.daemons.create({name: handler.identity.name});
        handler.identified(daemon);
        this.daemons.addConnection(handler);
        this.removePending(handler);
        await this.daemons.add(daemon);
        handler.send({event: "auth/key", key: daemon.key});
    }
}

module.exports = DaemonAuth;
const net = require("net");
const DaemonHandler = require("./handler");

/**
 * This class is in charge of the server which daemons can connect to.
 * @memberof net
 */
class DaemonServer {
    /**
     * Constructs the daemon server and creates an array the represents that event stack for this server.
     */
    constructor() {
        /**
         * The array of events that can be handled by each individual handler.
         * @type {Array.<Object>}
         */
        this.stack = [];
    }

    /**
     * Registers a new event to the stack specified by the event name and containing the specified callback.
     * @param {String} event The name of the event.
     * @param {Function} callback The callback is called to handle the event.
     */
    register(event, callback) {
        this.stack.push({
            event, callback
        });
    }

    /**
     * Unregisters the specified event from the stack.
     * @param {String} event The name of the event.
     */
    unregister(event) {
        const handlerIndex = this.stack.findIndex(handler => handler.event === event);

		if(handlerIndex < 0) return;

		this.stack.splice(handlerIndex);
    }

    /**
     * Initializes the daemon server.
     * @param {Object} parts The required parts for this class.
     * @param {Daemons} parts.daemons The daemon manager class.
     */
    initialize({daemons}) {
        this.daemons = daemons;
        /**
         * The server from Node's net package. It can only be used once the server has been initialized.
         * @type {net.Server}
         */
        this.server = net.createServer(socket => this.handleConnection(socket));
    }

    /**
     * Handles a new incoming socket that represents a daemon. A handler is created for this socket which is passed on
     * to the daemon manager.
     * @param {net.Socket} socket The socket.
     */
    handleConnection(socket) {
        const handler = new DaemonHandler(socket, this);

        this.daemons.newConnection(handler);
    }

    /**
     * Starts the daemon server.
     * @param {Object} options The options when starting.
     * @param {number} options.port The port to open the server on.
     * @returns {Promise} A promise that resolves when the server has started listening.
     */
    start({port} = {}) {
        return new Promise(resolve => {
            this.server.listen({
                port
            }, () => resolve());
        });
    }

    /**
     * Closes the daemon server.
     * @returns {Promise} A promise that resolves when the server has stopped listening.
     */
    close() {
        return new Promise((resolve, reject) => {
            this.server.close(err => {
                if(!this.server.listening) resolve();
                else if(err) reject(err);
                else resolve();
            });
        });
    }
}

module.exports = DaemonServer;
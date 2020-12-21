/**
 * This class handles a request with a daemon.
 * @memberof net
 */
class DaemonHandler {
    /**
     * Constructs some member variables and sets up event listeners for the socket.
     * @param {net.Socket} socket The socket.
     * @param {DaemonServer} daemonServer The daemon server.
     */
    constructor(socket, daemonServer) {
        /**
         * The socket from Node's net package.
         * @type {net.Socket}
         */
        this.socket = socket;
        /**
         * If the daemon this handler is handling has been identified.
         * @type {boolean}
         */
        this.isIdentified = false;
        /**
         * If the daemon this handler is handling is identified but still pending to be added to the panel.
         * @type {boolean}
         */
        this.pending = false;

        this.daemonServer = daemonServer;
        this.socket.on("data", chunk => this.handleData(chunk));
        this.socket.on("error", err => console.error(err));
    }

    /**
     * Handles in incoming chunk of data from the socket. This method will try to parse the chunk and if unsuccessful 
     * will add it to the existing buffer. If it is successfull it will handle the parsed data.
     * @param {Buffer} chunk The chunk of data.
     * @returns {Promise} A promise that is resolved when the given chunk of data has been handled.
     */
    handleData(chunk) {
        let buffer = this.buffer ? Buffer.concat([this.buffer, chunk]) : chunk;
        let data;
        
        try {
            data = JSON.parse(buffer.toString());
            this.buffer = undefined;
        }
        catch {
            this.buffer = buffer;

            return Promise.resolve();
        }

        return this.handle(data);
    }

    /**
     * Handles a parsed object of data that represends a transfer of information from the connected daemon for this
     * handler. It will look over the stack {@link DaemonServer.stack} to find an handler that can handle this data. If
     * no handler is found an error is sent to the daemon. If the event is "auth/identify" a special identification 
     * callback is called. If the daemon has not been identified yet no other handler will be called.
     * @param {Object} data The incoming data.
     * @returns {Promise} A promise that resolves when the data has been handles.
     */
    async handle(data) {
        const event = data.event;

        if(event === "auth/identify" && this.identifyCallback && !this.isIdentified) {
            await this.identifyCallback(data);

            return;
        }
        else if(!this.isIdentified) return;

        for(const handler of this.daemonServer.stack) {
            if(handler.event !== event) continue;

            await handler.callback(data, this.model, this);

            return;
        }

        this.send({event: "error", message: "Event not found."});
    }

    /**
     * Sends the specified data object to the daemon after it is stringified.
     * @param {Object} data The data object.
     */
    send(data = {}) {
        this.socket.write(JSON.stringify(data));
    }

    /**
     * Sets the daemon this handler handles to be identified.
     * @param {DaemonModel} model The daemon model.
     */
    identified(model) {
        this.model = model;
        this.isIdentified = true;
        this.pending = false;
    }

    /**
     * Closes the connection with the daemon this handler handles.
     * @param {Object} data The optional data that is sent on closure.
     */
    close(data) {
        this.socket.end(data ? JSON.stringify(data) : undefined);
    }
}

module.exports = DaemonHandler;
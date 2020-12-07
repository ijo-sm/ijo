const net = require("net");
const DaemonHandler = require("./handler");

class DaemonServer {
    constructor() {
        this.stack = [];
    }

    register(event, callback) {
        this.stack.push({
            event, callback
        });
    }

    unregister(event) {
        const handlerIndex = this.stack.findIndex(handler => handler.event === event);

		if(handlerIndex < 0) return;

		this.stack.splice(handlerIndex);
    }

    initialize({daemons}) {
        this.daemons = daemons;
        this.server = net.createServer(socket => this.handleConnection(socket));
    }

    handleConnection(socket) {
        this.daemons.newConnection(new DaemonHandler(socket, this));
    }

    start({port} = {}) {
        return new Promise(resolve => {
            this.server.listen({
                port
            }, () => resolve());
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.server.close(err => {
                if(err) reject(err);
                else resolve();
            });
        });
    }
}

module.exports = DaemonServer;
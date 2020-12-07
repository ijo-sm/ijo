const net = require("net");
const DaemonHandler = require("./daemonHandler");

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
        console.log("Connection");
        this.daemons.addConnection(socket);
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
class DaemonEvents {
    constructor(daemonServer) {
        daemonServer.register("ping", (data, model, handler) => this.ping(data, model, handler));
    }

    ping(data, model, handler) {
        handler.send({event:"pong"});
    }
}

module.exports = DaemonEvents;
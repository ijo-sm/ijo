class DaemonApi {
    constructor(apiServer, daemons) {
        apiServer.register("/daemons/pending", "GET", (...args) => this.pending(daemons, ...args));
    }

    pending(daemons, req, res) {
        res.send({
            data: daemons.pendingDaemons.map(daemon => {return {name: daemon.name, code: daemon.code}})
        });
    }
}

module.exports = DaemonApi;
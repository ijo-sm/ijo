const ApiModel = require("../net/api/model");

class DaemonApi extends ApiModel {
    constructor(apiServer, daemons) {
        super(apiServer);

        apiServer.register("/daemons/pending", "GET", (...args) => this.pending(daemons, ...args));
        apiServer.register("/daemons/add", "POST", (...args) => this.add(daemons, ...args))
    }

    pending(daemons, req, res) {
        res.send({
            data: daemons.pending.map(handler => {return {name: handler.identity.name, code: handler.identity.code}})
        });
    }

    async add(daemons, req, res) {
        const data = await req.bodyAsJSON();
        const handler = daemons.pending.find(handler => handler.identity.name === data.name);

        if(handler === undefined) {
            return res.sendError({message: "No pending daemon with that name found.", code: 400});
        }

        daemons.pendingToConnection(handler);

        res.send();
    }
}

module.exports = DaemonApi;
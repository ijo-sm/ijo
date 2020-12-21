const {ApiModel} = require("ijo-utils");

class DaemonApi extends ApiModel {
    constructor(apiServer, daemons) {
        super(apiServer);

        apiServer.register("/daemons/pending", "GET", (...args) => this.pending(daemons, ...args));
        apiServer.register("/daemons/add", "POST", (...args) => this.add(daemons, ...args))
    }

    pending(daemons, req, res) {
        res.send({
            data: daemons.auth.pending.map(handler => {return {name: handler.identity.name, code: handler.identity.code}})
        });
    }

    async add(daemons, req, res) {
        const data = await req.bodyAsJSON();
        const handler = daemons.auth.pending.find(handler => handler.identity.name === data.name);

        if(handler === undefined) {
            return res.sendError({message: "No pending daemon with that name found.", code: 400});
        }

        await daemons.auth.pendingToConnection(handler).catch(err => {
            res.sendError({message: "Something went wrong while adding the daemon", error: err.message, code: 500});
        });

        res.send({data: {message: "Added"}, code: 201});
    }
}

module.exports = DaemonApi;
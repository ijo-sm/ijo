const DaemonHandler = require("../net/daemonHandler");
const DaemonApi = require("./daemonApi");
const DaemonEvents = require("./daemonEvents");
const DaemonModel = require("./daemonModel");

class Daemons {
    constructor() {
        this.connectedDaemons = [];
        this.pendingDaemons = [];
    }

    initialize({database, daemonServer, apiServer} = {}) {
        database.register("daemons", DaemonModel);
        this.events = new DaemonEvents(daemonServer);
        this.api = new DaemonApi(apiServer, this);
    }

    load({database} = {}) {
        this.collection = database.collection("daemons");
    }

    async addConnection(socket) {
        const handler = new DaemonHandler(socket);

        setTimeout(() => {
            if(handler.pending || handler.isIdentified) return;
            handler.close();
        }, 3000);

        const identity = await handler.onIdentity();
        const daemon = await this.collection.findOne({name: identity.name});
        console.log("New connection by", socket.address(), daemon, identity);

        if(daemon) {
            if(!daemon.isEqualKey(identity.key)) return handler.close();

            handler.identified(daemon);
            this.connectedDaemons.push(handler);
        }
        else {
            handler.pending = true;
            this.addPendingDaemon(handler, identity);
        }
    }

    addPendingDaemon(handler, identity) {
        this.pendingDaemons.push({
            handler,
            code: identity.code,
            name: identity.name
        });
    }
}

module.exports = Daemons;
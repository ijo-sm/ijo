const DaemonApi = require("./api");
const DaemonEvents = require("./events");
const DaemonModel = require("./model");

class Daemons {
    constructor() {
        this.connectedHandlers = [];
        this.pending = [];
    }

    initialize({database, daemonServer, apiServer} = {}) {
        database.register("daemons", DaemonModel);
        this.events = new DaemonEvents(daemonServer);
        this.api = new DaemonApi(apiServer, this);
    }

    load({database} = {}) {
        this.collection = database.collection("daemons");
    }

    async addConnection(handler) {

        setTimeout(() => {
            if(handler.pending || handler.isIdentified) return;
            handler.close();
        }, 3000);

        const identity = await handler.onIdentity();
        const daemon = await this.collection.findOne({name: identity.name});
        console.log("New connection by", daemon, identity);

        if(daemon) {
            if(!daemon.isEqualKey(identity.key)) return handler.close();

            handler.identified(daemon);
            this.connectedHandlers.push(handler);
        }
        else {
            handler.pending = true;
            this.addPending(handler, identity);
        }
    }

    addPending(handler, identity) {
        this.pending.push({
            handler,
            code: identity.code,
            name: identity.name
        });
    }
}

module.exports = Daemons;
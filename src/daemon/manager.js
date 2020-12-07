const {nanoid} = require("nanoid");
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

    create({name}) {
        const key = nanoid(32);
        const daemon = new DaemonModel({name, key});

        return daemon;
    }

    add(daemon) {
        return this.collection.addOne(daemon);
    }

    async newConnection(handler) {
        await handler.onIdentity(handler);

        if(handler.identity === undefined) return;

        const daemon = await this.collection.findOne({name: handler.identity.name});
        console.log("New connection by", daemon, handler.identity);

        if(daemon) {
            if(!daemon.isEqualKey(handler.identity.key)) return handler.close({event:"error", reason: "identify/incorrect"});

            this.addConnection(handler, daemon);
        }
        else {
            if(await this.isNameUsed(handler.identity.name)) return handler.close({event: "error", reason: "identify/nameInUse"});

            this.addPending(handler);
        }
    }

    async pendingToConnection(handler) {
        const daemon = this.create({name: handler.identity.name});
        this.addConnection(handler, daemon);
        this.removePending(handler);
        await this.add(daemon);
        handler.send({event: "key", key: daemon.key});
    }

    addPending(handler) {
        handler.pending = true;
        this.pending.push(handler);
    }

    removePending(handler) {
        const handlerIndex = this.pending.find(pendingHandler => pendingHandler === handler);

        if(handlerIndex < 0) return;

        this.pending.splice(handlerIndex);
    }

    async isNameUsed(name) {
        return (await this.collection.findOne({name})) !== undefined 
            || this.pending.find(handler => handler.identity && handler.identity.name === name) !== undefined;
    }

    addConnection(handler, daemon) {
        handler.identified(daemon);
        this.connectedHandlers.push(handler);
    }
}

module.exports = Daemons;
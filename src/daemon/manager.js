const {nanoid} = require("nanoid");
const DaemonApi = require("./api");
const DaemonEvents = require("./events");
const DaemonModel = require("./model");
const Auth = require("./auth/manager");

class Daemons {
    constructor() {
        this.connectedHandlers = [];
        this.auth = new Auth();
    }

    initialize({database, daemonServer, apiServer} = {}) {
        database.register("daemons", DaemonModel);
        this.events = new DaemonEvents(daemonServer);
        this.api = new DaemonApi(apiServer, this);
        this.auth.initialize({daemons: this});
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

    newConnection(handler) {
        this.auth.authenticate(handler);
    }

    async isNameUsed(name) {
        return (await this.collection.findOne({name})) !== undefined 
            || this.auth.pending.find(handler => handler.identity && handler.identity.name === name) !== undefined;
    }

    addConnection(handler) {
        this.connectedHandlers.push(handler);
    }
}

module.exports = Daemons;
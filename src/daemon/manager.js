const {nanoid} = require("nanoid");
const DaemonApi = require("./api");
const DaemonEvents = require("./events");
const DaemonModel = require("./model");
const Auth = require("./auth/manager");

/**
 * This class manages all of the daemons.
 */
class Daemons {
    /**
     * On creation an array containing the connected daemon handlers and the authentication manager are created.
     */
    constructor() {
        this.connectedHandlers = [];
        this.auth = new Auth();
    }

    /**
     * Initializes the daemon manager.
     * @param {Object} parts The required parts from IJO's core.
     * @param {Database} parts.database The database.
     * @param {DaemonServer} parts.daemonServer The daemon server.
     * @param {ApiServer} parts.apiServer The api server.
     */
    initialize({database, daemonServer, apiServer} = {}) {
        database.register("daemons", DaemonModel);
        this.events = new DaemonEvents(daemonServer);
        this.api = new DaemonApi(apiServer, this);
        this.auth.initialize({daemons: this});
    }

    /**
     * Loads the daemon manager.
     * @param {Object} parts The required parts from IJO's core.
     * @param {Database} parts.database The database.
     */
    load({database} = {}) {
        this.collection = database.collection("daemons");
    }

    /**
     * Creates and returns a new daemon model. It also creates a key for this daemon.
     * @param {Object} options The options for the daemon.
     * @param {String} options.name The name of the daemon. 
     */
    create({name}) {
        const key = nanoid(32);
        const daemon = new DaemonModel({name, key});

        return daemon;
    }

    /**
     * Adds the specified daemon to the database.
     * @param {DaemonModel} daemon The daemon.
     */
    add(daemon) {
        return this.collection.addOne(daemon);
    }

    /**
     * Handles the newly connected handler.
     * @param {DaemonHandler} handler The daemon handler.
     */
    newConnection(handler) {
        this.auth.authenticate(handler);
    }

    /**
     * Returns if the specified name is already used. It checks both the database and the list of pending daemons.
     * @param {String} name The name to check.
     * @returns {Boolean} If the specified name is already used.
     */
    async isNameUsed(name) {
        return (await this.collection.findOne({name})) !== undefined 
            || this.auth.pending.find(handler => handler.identity && handler.identity.name === name) !== undefined;
    }

    /**
     * Adds the specified daemon handler to the list of connected daemon handlers.
     * @param {DaemonHandler} handler The daemon handler.
     */
    addConnection(handler) {
        this.connectedHandlers.push(handler);
    }
}

module.exports = Daemons;
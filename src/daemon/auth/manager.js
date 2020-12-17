class Auth {
    constructor() {
        this.pending = [];
    }

    initialize({daemons}) {
        this.daemons = daemons;
    }

    async authenticate(handler) {
        let timedOut = false;

        setTimeout(() => {
            if(handler.pending || handler.isIdentified) return;
            timedOut = true;
            handler.close();
        }, 3000);

        const identity = await new Promise(resolve => {
            handler.identifyCallback = data => resolve(data);
        });

        if(timedOut) return;

        handler.identity = identity;

        const daemon = await this.daemons.collection.findOne({name: handler.identity.name});

        if(daemon) this.authKnown(handler, daemon);
        else this.authUnknown(handler);
    }

    authUnknown(handler) {
        if(this.pending.find(pending => pending.identity.name === handler.name)) {
            return handler.send({event: "nameInUse"});
        }
        if(typeof(handler.identity.name) !== "string") {
            return handler.send({event: "auth/incorrect"});
        }
        if(typeof(handler.identity.code) !== "string") {
            return handler.send({event: "auth/incorrect"});
        }

        this.addPending(handler);
    }

    authKnown(handler, daemon) {
        if(daemon.key !== handler.identity.key) {
            return handler.send({event: "auth/incorrect"});
        }

        this.authenticated(handler, daemon);
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

    authenticated(handler, daemon) {
        handler.send({event: "auth/correct"});
        handler.identified(daemon);
        this.daemons.addConnection(handler);
    }

    async pendingToConnection(handler) {
        const daemon = this.daemons.create({name: handler.identity.name});
        this.daemons.addConnection(daemon);
        this.removePending(handler);
        await this.daemons.add(daemon);
        handler.send({event: "auth/key", key: daemon.key});
    }
}

module.exports = Auth;
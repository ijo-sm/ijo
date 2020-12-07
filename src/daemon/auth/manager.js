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
        const daemon = this.create({name: handler.identity.name});
        this.addConnection(handler, daemon);
        this.removePending(handler);
        await this.add(daemon);
        handler.send({event: "auth/key", key: daemon.key});
    }
}

module.exports = Auth;
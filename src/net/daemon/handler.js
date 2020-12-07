class DaemonHandler {
    constructor(socket, daemonServer) {
        this.socket = socket;
        this.socket.on("data", chunk => this.handleData(chunk));
        this.socket.on("error", err => console.error(err));
        this.daemonServer = daemonServer;
        this.isIdentified = false;
        this.pending = false;
    }

    handleData(chunk) {
        let buffer = this.buffer ? Buffer.concat([this.buffer, chunk]) : chunk;
        let data;
        
        try {
            data = JSON.parse(buffer.toString());
        }
        catch {
            this.buffer = buffer;

            return;
        }

        this.handle(data);
    }

    async handle(data) {
        const event = data.event;

        if(event === "identify" && this.identifyCallback && !this.isIdentified) {
            return this.identifyCallback(data);
        }
        if(!this.isIdentified) return;

        for(const handler of this.daemonServer.stack) {
            if(handler.event !== event) continue;

            const canContinue = await handler.callback(data, this.model, this);

            if(!canContinue) return;
        }

        this.send({event: "error", message: "Event not found."});
    }

    send(data = {}) {
        this.socket.write(JSON.stringify(data));
    }

    async onIdentity() {
        let timedOut = false;

        setTimeout(() => {
            if(this.pending || this.isIdentified) return;
            timedOut = true;
            this.close();
        }, 3000);

        const identity = await new Promise(resolve => {
            this.identifyCallback = data => resolve(data);
        });

        if(timedOut) return;

        this.identity = identity;
    }

    identified(model) {
        this.model = model;
        this.isIdentified = true;
        this.pending = false;
    }

    close(data) {
        this.socket.end(data ? JSON.stringify(data) : undefined);
    }
}

module.exports = DaemonHandler;
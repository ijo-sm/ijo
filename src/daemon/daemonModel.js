const Model = require("../database/model");

class DaemonModel extends Model {
    constructor({name, key}) {
        super();

        this.name = name;
        this.key = key;
    }

    isEqualKey(key) {
        return this.key === key;
    }

    toObject() {
        super.toObject();

        return {
            name: this.name,
            key: this.key
        }
    }
}

module.exports = DaemonModel;
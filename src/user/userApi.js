const Database = require("../database/database");
const Api = require("../net/api");
const ApiModel = require("../net/apiModel");

class UserApi extends ApiModel {
    initialize(api) {
        super.initialize(api);

        api.register("/user/create", "POST", (...args) => this.create(...args));
    }

    start({database}) {
        super.start();

        this.collection = database.collection("users");
    }

    create(req, res) {

    }
}

module.exports = UserApi;
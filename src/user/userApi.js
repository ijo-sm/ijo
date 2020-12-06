const ApiModel = require("../net/apiModel");

class UserApi extends ApiModel {
    constructor(api, users) {
        super(api);

        api.register("/user/create", "POST", (...args) => this.create(...args));
    }

    start({database}) {
        super.start();

        this.collection = database.collection("users");
    }

    create(req, res) {

        res.send({data: {message: "Created"}, code: 201});
    }
}

module.exports = UserApi;
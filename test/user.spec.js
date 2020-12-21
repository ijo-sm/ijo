const expect = require("chai").expect;
const {CryptoUtils} = require("ijo-utils");
const UserManager = require("../src/user/manager");

describe("UserManager", () => {
    describe("#create()", () => {
        it("should create a UserModel and return that when a username and password is supplied", () => {
            const manager = new UserManager();
            const user = manager.create({username: "test", password: "test"});
            const obj = user.toObject();

            expect(obj.username).to.equal("test");
            expect(obj.password).to.equal(CryptoUtils.hash("test"));
            expect(obj.id).to.have.lengthOf(16);
        });
    });

    describe("#verifyUser()", () => {
        it("should return the same userid as in the correct token", async () => {
            const userid = 10101;
            const manager = new UserManager();
            manager.auth.initialize({auth: {secret: "test", expiresIn: "1d"}});
            const token = await manager.auth.createToken(userid);
            const req = {getBearerToken: () => token};

            expect(await manager.verifyUser(req)).to.equal(userid);
        });

        it("should send an error when the token has expired", async () => {
            const manager = new UserManager();
            manager.auth.initialize({auth: {secret: "test", expiresIn: "0s"}});
            const token = await manager.auth.createToken(10101);
            const req = {getBearerToken: () => token};
            const res = {sendError: data => {
                expect(data.message).to.equal("The user token has expired.");
                expect(data.code).to.equal(400);
            }}

            await manager.verifyUser(req, res);
        });
    });
});

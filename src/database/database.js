const Database = include("@ijo-sm/helper-database");
const Utils = include("@ijo-sm/utils");

module.exports = new Database(Utils.path.resolve("../data/panel.json"));
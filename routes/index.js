const routes = require("express").Router();

routes.use("/employees", require("./employees.routes"));
routes.use("/register", require("./register.routes"));
routes.use("/learning", require("./learning.routes"));
routes.use("/login", require("./login.routes"));

module.exports = routes;

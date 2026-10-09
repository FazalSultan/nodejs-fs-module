const routes = require('express').Router()



routes.use('/employees' , require('./employees.routes'))
routes.use("/register", require("./registerEmployee.routes"));


module.exports = routes
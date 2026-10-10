const routes = require('express').Router()



routes.use('/employees' , require('./employees.routes'))
routes.use("/register", require("./registerEmployee.routes"));
routes.use("/learning" , require('./learning.routes'))


module.exports = routes
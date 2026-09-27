const routes = require('express').Router()



routes.use('/employees' , require('./employees.routes'))


module.exports = routes
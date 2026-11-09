const routes =  require('express').Router();
const registerEmployeeControler   = require ('../controllers/register.controller');

routes.post('/register' , registerEmployeeControler.registerEmployee )

module.exports =  routes;
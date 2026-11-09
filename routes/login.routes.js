const routes = require('express').Router();
const loginController =  require('../controllers/login.controller')

routes.post('/login' , loginController.handleLoginUser)
module.exports =  routes;
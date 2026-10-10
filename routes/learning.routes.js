const routes =  require('express').Router();
const learningController  = require('../controllers/learning.controller')

routes.post('/selflearning' ,  learningController.selfLearning)
module.exports   = routes;
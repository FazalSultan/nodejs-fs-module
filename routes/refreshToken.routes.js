const routes = require('express').Router();
const refreshTokenController = require('../controllers/refreshToken.controller');

routes.post('/refreshtoken' ,  refreshTokenController.handleRefreshToken)

module.exports = routes;
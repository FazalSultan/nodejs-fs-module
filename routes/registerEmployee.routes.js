const router = require('express' ) .Router();
const registerEmployeeController  =    require('../controllers/registerEmployee.controller')


router.post('/register' , registerEmployeeController.handleEmployeeRegisteration)
module.exports = router;
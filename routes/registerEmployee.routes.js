const router = require('express' ) .Router();
const registerEmployeeController  =    require('../controllers/registerEmployee.controller')


router.post('/auth' , registerEmployeeController.handleEmployeeRegisteration)
module.exports = router;
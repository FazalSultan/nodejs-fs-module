const routes = require("express").Router();
const employeesController = require("../controllers/employees.controller");
const verifyJWT = require('../middlewares/verifyJWT.middleware');
const verifyRole = require('../middlewares/verifyRoles.middleware');
const rolesList =  require('../constant/rolesList');

routes.get("/getEmployee", verifyJWT , verifyRole(rolesList.Admin , rolesList.Editor) , employeesController.getEmployees);
routes.post("/createEmployee", verifyRole(rolesList.Admin) , employeesController.createEmployee);
routes.put("/:id", employeesController.updateEmployee);
routes.delete("/:id", employeesController.deleteEmployee);
routes.patch('/:id' , employeesController.patchEmployee)

module.exports = routes;
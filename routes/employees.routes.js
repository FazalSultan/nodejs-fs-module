const routes = require("express").Router();
const employeesController = require("../controllers/employees.controller");
const verifyJWT = require('../middlewares/verifyJWT.middleware')

routes.get("/getEmployee", verifyJWT , employeesController.getEmployees);
routes.post("/createEmployee", employeesController.createEmployee);
routes.put("/:id", employeesController.updateEmployee);
routes.delete("/:id", employeesController.deleteEmployee);
routes.patch('/:id' , employeesController.patchEmployee)

module.exports = routes;
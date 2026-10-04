const routes = require("express").Router();
const employeesController = require("../controllers/employees.controller");

routes.get("/getEmployee", employeesController.getEmployees);
routes.post("/createEmployee", employeesController.createEmployee);
routes.put("/:id", employeesController.updateEmployee);
routes.delete("/:id", employeesController.deleteEmployee);
routes.patch('/:id' , employeesController.patchEmployee)

module.exports = routes;
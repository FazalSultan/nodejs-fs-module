const data = require("../constant/constant");
const mongoose = require("mongoose");
const Employee = require("../model/employee/employee.model");

module.exports = {
  getEmployees: async (req, res) => {
    const DEFAULT_LIMIT = 5;
    const DEFAULT_PAGE = 1;
    const MAX_LIMIT = 100;

    try {
      // query me value na ho to default, warna parse karo
      let limit =
        req.query.limit === undefined
          ? DEFAULT_LIMIT
          : parseInt(req.query.limit, 10);
      let page =
        req.query.page === undefined
          ? DEFAULT_PAGE
          : parseInt(req.query.page, 10);

      if (Number.isNaN(limit) || Number.isNaN(page)) {
        return res.status(400).send({
          code: 400,
          message: "Page or Limit has invalid type",
        });
      }

      if (limit <= 0) limit = DEFAULT_LIMIT;
      if (page <= 0) page = DEFAULT_PAGE;
      limit = Math.min(limit, MAX_LIMIT);

      const skip = (page - 1) * limit;

      const [employees, total] = await Promise.all([
        Employee.find().sort({ _id: -1 }).skip(skip).limit(limit).lean(),
        Employee.countDocuments(),
      ]);

      return res.status(200).send({
        code: 200,
        res: employees,
        pagination: {
          limit,
          page,
          totalItems: total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("getEmployees error:", error);
      return res.status(500).send({
        code: 500,
        message: "Internal server error",
      });
    }
  },
  createEmployee: async (req, res) => {
    try {
      const { first_name, last_name, email, gender } = req.body;

      //  Basic presence validation
      if (!first_name || !last_name || !email || !gender) {
        return res.status(400).json({
          message: "first_name, last_name, email, and gender are required",
        });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const duplicateEmail = await Employee.findOne({ email: normalizedEmail });

      if (duplicateEmail) {
        return res.status(409).json({
          message: "An employee already exists with this email",
        });
      }

      // Create employee in the DB
      const newEmployee = await Employee.create({
        firstName: first_name,
        lastName: last_name,
        email: normalizedEmail,
        gender: gender,
      });

      return res.status(201).json({
        data: newEmployee,
        message: "New employee has been created",
      });
    } catch (error) {
      // Handle Mongoose schema validation errors (e.g., invalid email format or gender enum)
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((val) => val.message);
        return res.status(400).json({ message: messages.join(", ") });
      }

      // Handle MongoDB unique index race condition (error code 11000)
      if (error.code === 11000) {
        return res.status(409).json({
          message: "An employee already exists with this email",
        });
      }

      console.error("createEmployee error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  updateEmployee: (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { first_name, last_name, email, gender } = req.body;

      // validation
      if (!first_name || !last_name || !email || !gender) {
        return res.status(400).send({
          message: "first_name, last_name, email and gender are required",
        });
      }

      const records = data.find((rec) => rec.id === id);

      // pehle check karo record mila ya nahi, tabhi update karo
      if (!records) {
        return res.status(404).send({
          data: [],
          message: "Employee does not exist",
        });
      }

      // ab safe hai update karna
      records.first_name = first_name.trim();
      records.last_name = last_name.trim();
      records.email = email.trim().toLowerCase();
      records.gender = gender;

      return res.status(200).send({
        data: records,
        message: "Employee information has been updated successfully!",
      });
    } catch (error) {
      return res.status(500).send({
        message: error.message,
        code: "500",
      });
    }
  },

  deleteEmployee: async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          code: 400,
          message: "Invalid employee id",
        });
      }

      const deletedEmployee = await Employee.findByIdAndDelete(id);

      if (!deletedEmployee) {
        return res.status(404).json({
          code: 404,
          message: `Employee not found with id ${id}`,
        });
      }

      return res.status(200).json({
        code: 200,
        message: "Employee deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        message: error.message,
        reason: "Internal Server Error",
      });
    }
  },

  patchEmployee: (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body; // jo bhi fields bheji gayi hain

      const index = data.findIndex((emp) => emp.id === id);

      /**
       * PATCH: In Patch if resource not found it will consider a failure
       */
      if (index === -1) {
        return res.status(404).send({
          message: `Employee not found with id ${id}`,
          code: "404",
        });
      }

      // koi field bheji hi nahi gayi
      if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).send({
          message: "No fields provided to update",
          code: "400",
        });
      }

      /**
       * PATCH: According to REST API rules if fields are missing leave that fields unchanged
       *
       */
      data[index] = { ...data[index], ...updates };

      return res.status(200).send({
        data: data[index],
        message: "Employee field has been updated!",
        code: "200",
      });
    } catch (error) {
      return res.status(500).send({
        message: error.message,
        code: "500",
        reason: "Internal Server Error",
      });
    }
  },
};

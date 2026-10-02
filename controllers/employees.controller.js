const data = require("../constant/constant");
module.exports = {
  getEmployees: (req, res) => {
    // Validation
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 7;
    const totalPages = Math.ceil(data.length / limit);

    try {
      const MAX_LIMIT = data.length;
      if (limit > MAX_LIMIT || limit < 1) limit = 7;
      if (typeof limit != "number") limit = 7;
      if (page > totalPages) {
        res.status(200).send({
          data: [],
          page,
          limit,
          pages: totalPages,
          message: "No more data on this page",
        });
      }

      const start = (page - 1) * limit;
      const end = start + limit;
      const sliceData = data.slice(start, end);
      const responseObj = {
        data: sliceData,
        page: page,
        limit: limit,
        pages: totalPages,
      };
      res.status(200).send(responseObj);
    } catch (error) {
      res.status(500).send({
        code: 501,
        message: error.message,
      });
    }
  },
  createEmployee: (req, res) => {
    try {
      const { first_name, last_name, email, gender } = req.body;

      // validation
      if (!first_name || !last_name || !email || !gender) {
        return res.status(400).send({
          message: "first_name, last_name, email and gender are required",
        });
      }

      // duplicate email check
      const emailExists = data.some(
        (emp) => emp.email.toLowerCase() === email.toLowerCase(),
      );
      if (emailExists) {
        return res.status(409).send({
          message: "An employee with this email already exists",
        });
      }

      // better id generation - last item ki id + 1
      const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;

      const newEmployee = {
        id: newId,
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: email.trim().toLowerCase(),
        gender,
      };

      // ab data ko actually update kar rahe hain (immutable way)
      data.push(newEmployee);

      return res.status(201).send({
        data: newEmployee,
        message: "New employee has been created",
      });
    } catch (error) {
      console.error("createEmployee error:", error);
      return res.status(500).send({ message: "Internal server error" });
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
  deleteEmployee: (req, res) => {
    // DELETE logic
    try {
      const id = parseInt(req.params.id);

      const index = data.findIndex((emp) => emp.id === id);

      if (index === -1) {
        return res.status(404).send({
          message: `Employee not found with id ${id}`,
          code: "404",
        });
      }

      const [deleteEmp] = data.splice(index, 1);
      return res.status(200).send({
        data: deleteEmp,
        code: "200",
        message: "Employee has been deleted!",
      });
    } catch (error) {
      return res.status(500).send({
        message: error.message,
        code: "500",
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
       * spread se sirf jo fields aayi hain wo overwrite hongi, baqi waisi rahengi
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

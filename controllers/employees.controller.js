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
      })
    }
  },
  createEmployee: (req, res) => {
    // POST logic
  },
  updateEmployee: (req, res) => {
    // PUT logic
  },
  deleteEmployee: (req, res) => {
    // DELETE logic
  },
};

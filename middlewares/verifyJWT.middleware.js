const jwt = require("jsonwebtoken");
require('dotenv').config();


const verifyJWT = (req, res, next) => {
  const header = req.headers["authorization"];

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).send({
      code: "401",
      message: "Header is missing - unAuthorized!",
    });
  }

  const token = header.split(" ")[1];

  jwt.verify(
    token,
    process.env.ACCESS_SECRET_TOKEN,
    { algorithms: ["HS256"] },
    (error, decoded) => {
      if (error) {
        return res.status(403).send({
          code: "403",
          message: "You're unable to access this resource.",
        });
      }

      req.user = decoded.email;
      next();
    },
  );
};

module.exports = verifyJWT;

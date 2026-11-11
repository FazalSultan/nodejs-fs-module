const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const header = req.headers["authorization"];
  if (!header) {
    return res.status(401).send({
      code: "401",
      message: "Header is missing - unAuthoirzed!",
    });
  }

  const token = header.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, { algorithm: "HS256" } , (error , decoded) =>{
    if(error){
        return res.status(403).send({
            code: "403",
            message: "You're are unable to access this Resources"
        })
    }
    req.user = decoded.email;
     next();
  });
};

module.exports = verifyJWT;

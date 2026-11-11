const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const fs = require("fs").promises;
const path = require("path");

const objUsers = {
  users: require("../constant/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const filePath = path.join(__dirname, "..", "constant", "users.json");
module.exports = {
  handleLoginUser: async (req, res) => {
    try {
      const { userEmail, userPassword } = req.body;
      if (!userEmail || !userPassword) {
        return res.status(400).send({
          code: "400",
          message: "User's Email and Password are Required!",
        });
      }

      if (userEmail && !userEmail.includes("@")) {
        return res.status(400).send({
          code: "400",
          message: "Email is not in a valid Format, it should includes @",
        });
      }

      const foundUser = objUsers.users.find(
        (person) => person.email == userEmail,
      );
      if (!foundUser) {
        return res.status(401).send({
          code: "401",
          message: "You're Un-Authorized, due this Access is Denied.",
        });
      }

      if (foundUser) {
        const matchUser = await bcrypt.compare(
          userPassword,
          foundUser.password,
        );
        if (matchUser) {
          //create JWT
          const accessToken = jwt.sign(
            { email: foundUser.email }, // avoiding password for secuirity purposes
            process.env.ACCESS_SECRET_TOKEN,
            { expiresIn: "15m", algorithm: "HS256" },
          );

          const refreshToken = jwt.sign(
            { email: foundUser.email }, // avoiding password for secuirity purposes
            process.env.REFRESH_SECRET_TOKEN,
            { expiresIn: "1d", algorithm: "HS256" },
          );

          /**
           * Now save the refreshToken in the file with the logged user.
           */
          const otherUser = objUsers.users.filter(
            (person) => person.email != foundUser.email,
          );
          const currentUser = { ...foundUser, refreshToken };
          
          //update it in memory
          objUsers.setUsers([...otherUser, currentUser]);

          //now write to the file
          await fs.writeFile(filePath, JSON.stringify(objUsers.users , null ,2));

          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            sameSite: "None",
            secure: true,
          });

          return res.status(200).send({
            code: "200",
            message: "You've Logged In.",
            accessToken,
          });
          
        } else {
          return res.status(401).send({
            code: "401",
            message: "Email or Password is Invalid",
          });
        }
      }
    } catch (error) {
      return res.status(500).send({
        code: "500",
        message: "Internal Server Error",
        info: error.message,
      });
    }
  },
};

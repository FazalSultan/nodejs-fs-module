const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const path = require("path");

const objUsers = {
  users: require("../constant/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

//path to the json file
const filePath = path.join(__dirname, "..", "constant", "users.json");

module.exports = {
  registerEmployee: async (req, res) => {
    try {
      const { userEmail, userPassword } = req.body;
      if (!userEmail || !userPassword) {
        return res.status(400).send({
          code: "400",
          message: "User's Email and are Required!",
        });
      }

      //Check for Duplicate
      const duplicate = objUsers.users.find(
        (person) => person.email == userEmail,
      );
      if (duplicate) {
        return res.status(409).send({
          code: "409",
          message: `User is exits with this email: ${userEmail}`,
        });
      }

      //if no duplicates , then create a hashpassword
      const hashedPassword = await bcrypt.hash(userPassword, 10);
      const newUser = {
        email: userEmail,
        password: hashedPassword,
      };

      objUsers.setUsers([...objUsers.users, newUser]);
      await fs.writeFile(
        filePath,
        JSON.stringify(objUsers.users, null, 2),
        "utf-8",
      );

      return res.status(201).send({
        code: "201 ",
        message: "User has been register!",
      });
    } catch (error) {
      return res.status(500).send({
        code: "500",
        message: "Internal Server Error",
        info: error.message,
      });
    }
  },
};

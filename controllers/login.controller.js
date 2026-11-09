const bcrypt = require("bcrypt");

const objUsers = {
  users: require("../constant/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
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

      if(userEmail && !userEmail.includes('@')){
        return res.status(400).send({
            code: '400',
            message: 'Email is not in a valid Format, it should includes @'
        })
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
          return res.status(200).send({
            code: "200",
            message: "You've Logged In.",
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

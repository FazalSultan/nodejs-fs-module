const jwt = require("jsonwebtoken");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs").promises;
require("dotenv").config();

const objUsers = {
  users: require("../constant/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const filePath = path.join(__dirname, "..", "constant", "users.json");

const cookieOptions = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  sameSite: "None",
  secure: true,
};

module.exports = {
  handleRefreshToken: async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ code: "401", message: "No refresh token" });
    }

    const foundUser = objUsers.users.find(
      (user) => user.refreshToken === refreshToken,
    );

    if (!foundUser) {
      res.clearCookie("refreshToken", cookieOptions);
      return res.status(403).json({ code: "403", message: "Forbidden" });
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_TOKEN,
      );

      if (decoded.email !== foundUser.email) {
        return res.status(403).json({ code: "403", message: "Forbidden" });
      }

      const accessToken = jwt.sign(
        { email: foundUser.email },
        process.env.ACCESS_SECRET_TOKEN,
        { expiresIn: "15m", algorithm: "HS256" },
      );

      // new refresh token (same secret jo verify me use hua)
      const newRefreshToken = jwt.sign(
        { email: foundUser.email },
        process.env.REFRESH_SECRET_TOKEN,
        { expiresIn: "1d", algorithm: "HS256", jwtid: crypto.randomUUID() },
      );

      const updatedUsers = objUsers.users.map((user) =>
        user.email === foundUser.email
          ? { ...user, refreshToken: newRefreshToken }
          : user,
      );

      objUsers.setUsers(updatedUsers);
      await fs.writeFile(filePath, JSON.stringify(updatedUsers, null, 2));

      res.cookie("refreshToken", newRefreshToken, cookieOptions);

      return res.status(200).json({
        code: "200",
        message: "Your access token is generated",
        accessToken,
      });
    } catch (error) {
      res.clearCookie("refreshToken", cookieOptions);
      return res.status(401).json({
        code: "401",
        message: "You are unAuthorized.",
      });
    }
  },
};

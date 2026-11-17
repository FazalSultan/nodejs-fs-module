const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    // verifyJWT ne roles set nahi kiye to aage mat jao
    if (!req.roles) {
      return res.status(401).send({
        code: "401",
        message: "Roles not found, or you have no permission to perform this action",
      });
    }

    // user ke roles mein se koi ek bhi allowed ho to pass
    const hasAccess = req.roles.some((role) => allowedRoles.includes(role));

    if (!hasAccess) {
      return res.status(403).send({
        code: "403",
        message: "You don't have permission for this",
      });
    }

    next();
  };
};

module.exports = verifyRole;
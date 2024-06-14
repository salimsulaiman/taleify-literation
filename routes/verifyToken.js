const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("authuser");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(400).json({
      status: res.statusCode,
      message: "Access Denied!",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      message: "Invalid Token!",
    });
  }
};

module.exports = { verifyToken: verifyToken };

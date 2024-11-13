const jwt = require("jsonwebtoken");
require("dotenv").config();

const key = process.env.JWT_KEY;

function generateToken(email, id) {
  const token = jwt.sign({ email, id }, key);
  return token;
}

const validateAuthorization = (req, res, next) => {
  // We don't want to check authorization for login and register
  const excludedPaths = ["/user/login", "/user/register"];
  if (excludedPaths.includes(req.path)) {
    return next();
  }
  try {
    // Check for token
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Missing token." });
    }

    // Verify token and save user data
    const token = req.headers.authorization.split("Bearer ")[1];
    const decoded = jwt.verify(token, key);
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(403).json("Forbidden.");
  }
};

module.exports = {
  generateToken,
  validateAuthorization,
};

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookie["token"];

  // If the token is missing, return a 401 response
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  // Verify the token using the secret key
  // process.env.SECRET
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    // If there is an error verifying the token, return a 403 response
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // If the token is valid, add the decoded token to the request object
    req.user = decoded;
    // Call the next middleware function
    next();
  });
};

module.exports = verifyToken;

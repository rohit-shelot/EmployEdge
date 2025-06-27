const jwt = require('jsonwebtoken');

const verifyToken = async(req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: Token missing" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SEC_Key);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verify Error:", error.message);
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
  }
};

module.exports = verifyToken;

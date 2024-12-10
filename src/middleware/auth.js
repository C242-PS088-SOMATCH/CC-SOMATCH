const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET; // Gantilah dengan secret key Anda

function verifyToken(req, res, next) {
  // Ambil token dari header Authorization
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied, token is missing" });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Menyimpan data user yang didekodekan dalam request
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = verifyToken;

import jwt from "jsonwebtoken";

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ message: "No token, access denied" });
    }
    
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Use data directly from token (no database query needed)
    req.user = {
      id: payload.id,
      email: payload.email,
      name: payload.name
    };
    
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};
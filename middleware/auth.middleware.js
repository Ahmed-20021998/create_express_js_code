const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;

    // Extract token
    const token =
        req.cookies?.token ||
        (authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader);

    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    const SECRET = process.env.JWT_SECRET || "fallback_for_dev";

    try {
        const decoded = jwt.verify(token, SECRET);

        req.user = decoded;

        next();

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token"
        });
    }
}

module.exports = authMiddleware;
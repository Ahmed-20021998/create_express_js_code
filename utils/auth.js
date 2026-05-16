const jwt = require("jsonwebtoken");

function generateToken(user) {
    const SECRET = process.env.JWT_SECRET || "fallback_for_dev";

    return jwt.sign(
        { id: user.id, email: user.email, fullName: user.fullName },
        SECRET,
        { expiresIn: "1h" }
    );
}

module.exports = { generateToken };
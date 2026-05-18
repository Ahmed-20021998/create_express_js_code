const jwt = require("jsonwebtoken");

function generateToken(user) {
    const SECRET = process.env.JWT_SECRET || "fallback_for_dev";
    return jwt.sign(
        { id: user.id, email: user.email, fullName: user.fullName },
        SECRET,
        { expiresIn: "7d" } // FIX #7: was "1h" — extended to 7 days
    );
}

module.exports = { generateToken };

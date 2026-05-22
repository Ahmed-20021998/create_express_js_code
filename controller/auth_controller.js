const { db, saveDB, nextId } = require("../DB/db");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/auth");

async function register(fullName, email, password) {
    if (!fullName || !email || !password) return { message: "All fields are required" };
    if (password.length < 8) return { message: "Password must be at least 8 characters" };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { message: "Invalid email format" };

    if (db.users.find(u => u.email === email)) return { message: "Email already exists" };

    const hashedPassword = await hashPassword(password);
    const newId = nextId(db.users); // FIX #2: safe ID

    db.users.push({ id: newId, fullName, email, password: hashedPassword });
    saveDB(db); // FIX #1: persist

    return {
        message: "User registered successfully",
        user: { id: newId, fullName, email }
    };
}

async function login(res, email, password) {
    const foundUser = db.users.find(u => u.email === email);
    if (!foundUser) return res.status(401).json({ message: "Invalid credentials" });

    const passwordMatch = await comparePassword(password, foundUser.password);
    if (!passwordMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken({ id: foundUser.id, email: foundUser.email, fullName: foundUser.fullName });

    res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 3600000 }); // FIX #7: 7 days

    return res.status(200).json({
        message: "Login successful",
        token,
        user: { fullName: foundUser.fullName, email: foundUser.email }
    });
}

function logout(res) {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
}

function getAllUsers() {
    return db.users.map(u => ({ fullName: u.fullName, email: u.email }));
}

module.exports = { register, login, logout, getAllUsers };

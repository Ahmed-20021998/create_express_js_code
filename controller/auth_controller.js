const usersDB = require("../DB/user.db");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/auth");

async function register(fullName, email, password) {
    if (!fullName || !email || !password) {
        return { message: "All fields are required" };
    }
    if (password.length < 8) {
        return { message: "Password must be at least 8 characters" };
    }
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailValid) {
        return { message: "Invalid email format" };
    }
    const existingUser = usersDB.find(u => u.email === email);

    if (existingUser) {
        return { message: "Email already exists" };
    }

    const hashedPassword = await hashPassword(password);

    const newId = usersDB.length + 1;

    usersDB.push({
        id: newId,
        fullName: fullName,
        email: email,
        password: hashedPassword
    });

    return {
        message: "User registered successfully",
        user: {
            id: newId,
            fullName: fullName,
            email: email,
        }
    };
}

async function login(res, email, password) {
    const foundUser = usersDB.find(u => u.email === email);

    if (!foundUser) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await comparePassword(password, foundUser.password);

    if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // ↓ use foundUser — not user
    const token = generateToken({ id: foundUser.id, email: foundUser.email , fullName: foundUser.fullName });

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3600000
    });

    return res.status(200).json({
        message: "Login successful",
        token,
        user: {
            fullName: foundUser.fullName, // ← foundUser not user
            email: foundUser.email
        }
    });
}

function logout(res) {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
}

function getAllUsers() {
    return usersDB.map(u => ({
        fullName: u.fullName,
        email: u.email
    }));
}

module.exports = {
    register,
    login,
    logout,
    getAllUsers
}
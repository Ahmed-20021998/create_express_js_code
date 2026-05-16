const usersDB = require("../DB/user.db");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/auth");


class Users {

    constructor(fullName, email, password) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
    }

    async register() {
        if (!this.fullName || !this.email || !this.password) {
            return { message: "All fields are required" };
        }
        if (this.password.length < 8) {
            return { message: "Password must be at least 8 characters" };
        }
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
        
        if (!emailValid) {
            return { message: "Invalid email format" };
        }
        const existingUser = usersDB.find(u => u.email === this.email);

        if (existingUser) {
            return { message: "Email already exists" };
        }

        const hashedPassword = await hashPassword(this.password);

        const newId = usersDB.length + 1;

        usersDB.push({
            id: newId,
            fullName: this.fullName,
            email: this.email,
            password: hashedPassword
        });

        return {
            message: "User registered successfully",
            user: {
                id: newId,
                fullName: this.fullName,
                email: this.email,
            }
        };
    }

    // ↓ res is passed as parameter so we can set cookie here
    async login(res) {
        const foundUser = usersDB.find(u => u.email === this.email);

        if (!foundUser) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const passwordMatch = await comparePassword(this.password, foundUser.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // ↓ use foundUser — not user
        const token = generateToken({ id: foundUser.id, email: foundUser.email });

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

    logout(res) {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });
    }

    getAllUsers() {
        return usersDB.map(u => ({
            fullName: u.fullName,
            email: u.email
        }));
    }
}

module.exports = Users;
const express = require("express");
const Users = require("../models/User.js");
const authMiddleware = require("../middleware/auth.middleware");


const router = express.Router();

router.post("/register", async (req, res) => {
    // Code to handle user registration
    const { fullName, email, password } = req.body;
    const user = new Users(fullName, email, password);
    res.send(await user.register());
});

router.post("/login", async (req, res) => {
    // Code to handle user login
    const { email, password } = req.body;
    const user = new Users("", email, password);
    res.send(await user.login(res));
});

router.post("/logout", (req, res) => {
    // Code to handle user logout
    const user = new Users();
    res.send(user.logout(res));
});

router.get("/getUsers", authMiddleware, async (req, res) => {
    const user = new Users();

    const users = await user.getAllUsers();

    res.send(users);
});

module.exports = router;
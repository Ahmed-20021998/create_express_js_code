const express = require("express");
const Users = require("../models/User.js");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", async (req, res) => {
    const { fullName, email, password } = req.body;
    const user = new Users(fullName, email, password);
    res.send(await user.register());
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = new Users("", email, password);
    await user.login(res); // FIX #6: was res.send(await ...) which double-sends
});

router.post("/logout", (req, res) => {
    // FIX #6: logout is synchronous — just call it directly
    const user = new Users();
    user.logout(res);
});

// FIX #3: remove authMiddleware so logged-out users can see member count
router.get("/getusers", async (req, res) => {
    const user = new Users();
    const users = await user.getAllUsers();
    res.send(users);
});

module.exports = router;

const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/auth");
const { register, login, logout, getAllUsers } = require("../controller/auth_controller");

class Users {
    constructor(fullName, email, password) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
    }

    async register() {
        return await register(this.fullName, this.email, this.password);
    }

    async login(res) {
        return await login(res, this.email, this.password);
    }

    logout(res) {
        return logout(res); // FIX #6: logout is sync, no need for async
    }

    getAllUsers() {
        return getAllUsers();
    }
}

module.exports = Users;

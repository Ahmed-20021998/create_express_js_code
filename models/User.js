const usersDB = require("../DB/user.db");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/auth");
const {register , login , logout , getAllUsers} = require("../controller/auth_controller");


class Users {

    constructor(fullName, email, password) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
    }

    async register() {
        return await register(this.fullName, this.email, this.password);
    }

    // ↓ res is passed as parameter so we can set cookie here
    async login(res) {
        return await login(res,this.email, this.password);
    }

    async logout(res) {
        return await logout(res);
    }

    getAllUsers() {
        return getAllUsers();
    }
}

module.exports = Users;
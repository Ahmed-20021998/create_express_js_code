const bcrypt = require("bcrypt");

function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

function comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}

module.exports = {
    hashPassword,
    comparePassword
};
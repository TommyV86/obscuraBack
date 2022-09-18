const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    role: { type: Number, required: true },
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    email: { type: String, required: true},
    passwordHash: {type: String, required: true},
    salt : {type: String, required: true},
    token: { type: String, required: false}
})

module.exports = mongoose.model("user", UserSchema);
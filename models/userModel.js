const mongoose = require('mongoose')
let crypto = require('crypto')

const UserSchema = new mongoose.Schema({
    firstName: String, required: true,
    lastName: String, required: true,
    email: String, required: true,
    token: String, required: false
})

// Method to set salt and hash the password for a user 
UserSchema.methods.setPassword = (pswd) => {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.passwordHash = crypto.pbkdf2Sync(pswd, this.salt, 1000, 64, 'sha256').toString('hex')
}

// Method to check the entered password is correct or not 
UserSchema.methods.validPassword = (pswd) => {
    let pswdHash = crypto.pbkdf2Sync(pswd, this.salt, 1000, 64, 'sha256').toString('hex')
    return this.passwordHash === pswdHash
}


module.exports = mongoose.model("user", UserSchema)
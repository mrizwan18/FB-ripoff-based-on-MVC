const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    salt: String,
    dob: { type: Date, default: new Date() },
    gender: String

}, {
    timestamps: true
});
// Events
userSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.salt = salt;
            next();
        });
    });
});

module.exports = mongoose.model('User', userSchema);
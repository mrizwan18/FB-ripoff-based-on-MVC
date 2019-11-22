const User = require('../models/user');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
// Create and Save a new User
exports.signUp = (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var error_msg = ''
        errors.errors.forEach(function (error) {
            error_msg += error.param + " : " + error.msg + '<br>'
        });
        return res.send(error_msg);
    }

    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Mail already exists"
                });
            } else {
                // Create a User
                const user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,
                    dob: req.body.bday,
                    gender: req.body.gender
                });

                // Save User in the database
                user.save()
                    .then(data => {
                        res.cookie('currentUser', data);
                        return res.redirect("http://localhost:3000/home");
                    }).catch(err => {
                        return res.status(500).send({
                            message: err.message || "Some error occurred while creating the User."
                        });
                    });

            }
        });
};

// Find a single user with a userId
exports.login = (req, res) => {
    User.findOne({ email: req.body.emailLogin })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed 1"
                });
            }
            bcrypt.compare(req.body.passwordLogin, user.password, function (err, result) {
                if (err) res.send({ message: "Wrong credentials" });
                else {
                    if (result) {
                        res.cookie('currentUser', user.email);
                        return res.sendFile("check.html", { root: 'app/views' });
                    }
                    else
                        res.send({ result: result, message: "Auth failed" });

                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "Some DB error ocurred"
            });
        });
};

exports.user_delete = (req, res, next) => {
    User.deleteOne({ email: req.cookies['currentUser'] })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

const User = require('../models/user');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
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
                        return res.render("home", { user: data });
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
                        res.cookie('currentUser', result);
                        return res.render("home", { user: user });
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

exports.edit = (req, res) => {
    User.findOne({ _id: req.params.userId })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed 1"
                });
            }
            else {
                res.render("edit", { user: user });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "Some DB error ocurred"
            });
        });
};
exports.pass = (req, res) => {
    User.findOne({ _id: req.params.userId })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed 1"
                });
            }
            else {
                res.render("pass", { user: user });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "Some DB error ocurred"
            });
        });
};

exports.user_delete = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.render("register");
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.getUser = (req, res, next) => {
    User.find({ _id: req.params.userId })
        .exec()
        .then(user => {
            if (user.length == 0)
                return res.status(401).json({
                    message: "User not found"
                });

            return res.status(200).json({
                message: user
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.editDetails = (req, res, next) => {
    User.findByIdAndUpdate(req.params.userId,
        {
            $set:
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                dob: req.body.bday,
                gender: req.body.gender,
            }
        },
        { new: true })
        .exec()
        .then(user => {
            if (user.length == 0)
                return res.status(401).json({
                    message: "User not found"
                });

            res.render("home", { user: user });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.changePass = (req, res, next) => {
    if (req.body.newPassword === req.body.newCPassword) {
        bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
            if (err)
                return res.status(401).json({
                    message: err
                });
            else {
                User.findByIdAndUpdate(req.params.userId,
                    {
                        $set:
                        {
                            password: hash,
                        }
                    },
                    { new: true })
                    .exec()
                    .then(user => {
                        if (user.length == 0)
                            return res.status(401).json({
                                message: "User not found"
                            });
                        res.render("home", { user: user });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
            }
        })
    }
    else {
        return res.status(401).json({
            message: "Something went wrong"
        })
    }
}

exports.logout = (req, res, next) => {
    res.clearCookie('userData');
    return res.render("register");
}

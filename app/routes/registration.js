const { check, validationResult } = require('express-validator');
module.exports = (app) => {
    const users = require('../controllers/registration');

    // Create a new User
    app.post('/signUp', [check('firstName').isLength({ min: 1 }),
    check('lastName').isLength({ min: 1 }),
    check('email').isEmail(),
    check('bday').isLength({ min: 1 }),
    // password must be at least 7 chars long
    check('password').isLength({ min: 7 })], users.signUp);

    // Retrieve a single User with userId
    app.post('/login', users.login);
    app.post("/deleteUser",  users.user_delete);
}
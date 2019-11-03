const express = require('express');
const router = express.Router();
const users = require('../controllers/fb.controller');

router.get('/', (req, res) => {
    res.render('reg');
});
// Create a new User
router.post('/register', users.create);

// Retrieve a single User with userId
router.get('/users/:userId', users.findOne);

// Update a User with userId
router.put('/users/:userId', users.update);

// Delete a User with userId
router.delete('/users/:userId', users.delete);
module.exports = router;

const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const cookieParser = require('cookie-parser');
// create express app
const app = express();
app.use('/static', express.static('app/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())
app.use(cookieParser());

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.set('views', path.join(__dirname + '/app/views'));
app.set('view engine', 'ejs');


// define a simple route
app.get('/', (req, res) => {
    res.render('register')
});
app.get('/home', (req, res) => {
    res.render('home')
});


require('./app/routes/registration')(app);

// listen for requests
app.listen(4000, () => {
    console.log("Server is listening on port 3000");
});
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const hbs = require('express-hbs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const expressValidator = require('express-validator');



// create express app
const app = express();
app.use('/static', express.static('app/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

app.use(cookieParser());
app.use(session({ secret: 'razi', saveUninitialized: false, resave: false }));

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


const fb = require('./app/routes/fb.routes');
app.use('/', fb);

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
require('dotenv').config()
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path 	 = require('path');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');
var favicon = require('serve-favicon');

app.use(session({
    secret: 'cloud',
    saveUninitialized: false,
    resave: true,
    rolling: true,
    cookie: {
        maxAge: 1200000 // 20 minutes idle
    }
}));

app.use(favicon(__dirname + '/assets/images/google-favicon.jpeg'));
app.use(express.static(path.join(__dirname, 'assets')))
app.use(express.static(path.join(__dirname, 'bower_components')))
// configuration ===============================================================
//mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// Set Template Engine
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Static assets folder 
app.use(express.static('assets'));
// Body Parser
app.use(bodyParser());

//app.set('view engine', 'ejs');

// routes
require('./app/routes.js')(app, passport);

// launch the server
app.listen(port);
console.log('Google Multi-Cluster Gateway Demo app is listening on port ' + port);
// app/routes.js
module.exports = function (app, passport) {
    var request = require("request");
    var bodyParser = require('body-parser');
    var api_controller = require('./controllers/api-controller');
    app.use(bodyParser());

    var podName = process.env.MY_POD_NAME;
    var nodeName = process.env.MY_NODE_NAME;
    var nodeIP = process.env.MY_NODE_IP;
    var podNamespace = process.env.MY_POD_NAMESPACE;
    var podIP = process.env.MY_POD_IP;
    var podServiceAccount = process.env.MY_POD_SERVICE_ACCOUNT;

    var gcpRegion = process.env.GCP_REGION;

    if (gcpRegion === "asia-southeast1") {
        var regionName = "Singapore - asia-southeast1 region";
        var colorCode = "green";
    } else if (gcpRegion === "asia-east1") {
        var regionName = "Taiwan - asia-east1 region";
        var colorCode = "red";
    } else if (gcpRegion === "asia-east2") {
        var regionName = "Hong Kong - asia-east2 region";
        var colorCode = "yellow";
    } else if (gcpRegion === "asia-southeast2") {
        var regionName = "Indonesia - asia-southeast2 region";
        var colorCode = "blue";
    } else if (gcpRegion === "asia-south1") {
        var regionName = "Mumbai - asia-south1 region";
        var colorCode = "pink";
    } else if (gcpRegion === "asia-south2") {
        var regionName = "Delhi - asia-south2 region";
        var colorCode = "brown";
    } else if (gcpRegion === "australia-southeast1") {
        var regionName = "Sydney - australia-southeast1 region";
        var colorCode = "olive";
    } else if (gcpRegion === "australia-southeast2") {
        var regionName = "Melbourne - australia-southeast2 region";
        var colorCode = "orange";
    } else if (gcpRegion === "asia-northeast1") {
        var regionName = "Tokyo - asia-northeast1 region";
        var colorCode = "teal";
    } else if (gcpRegion === "asia-northeast2") {
        var regionName = "Osaka - asia-northeast2 region";
        var colorCode = "violet";
    } else {
        var regionName = "Unknown GCP region";
        var colorCode = "black";
    }


    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    //app.get('/', function(req, res) {
    //    res.render('console-home.ejs', { message: req.flash('loginMessage') }); // load the index.ejs file
    //});
    app.get('/', function(req, res) {
        res.render('console-home.ejs', { podName: podName,
            nodeName: nodeName,
            nodeIP: nodeIP,
            podNamespace: podNamespace,
            podIP: podIP,
            podServiceAccount: podServiceAccount,
            colorCode: colorCode,
            regionName: regionName
        }); // load the index.ejs file
    });
    // =====================================
    // LOGIN ===============================
    // =====================================

    app.post('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('console-home.ejs', {user : req.user});
    });

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/', isLoggedIn, function (req, res) {
        console.log('Reached the routes.js');
        res.render('getting-started.ejs', { user : req.user });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/api/analyzeHealth', api_controller.getBearer);
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    // if they aren't redirect them to the home page
    res.redirect('/');
}

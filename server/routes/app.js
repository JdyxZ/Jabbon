/***************** APP ROUTES *****************/

// External modules
const express = require('express');
const router = express.Router();

// Our modules
const LOCKER = require("../utils/locker.js");

// App routes
router.get('/', LOCKER.isSessionNotAvailable, (req, res) => {
    res.redirect("/login");
});

router.get('/login', LOCKER.isSessionNotAvailable, (req, res) => { 
    res.render("login", {current_view: "login"});
});

router.get('/signup', LOCKER.isSessionNotAvailable, (req, res) => { 
    res.render("signup", {current_view: "signup"});
});

router.get('/logout', LOCKER.isSessionAvailable, (req, res, next) => {
    req.logout(function(err) {
        if (err) return next(err);
        res.redirect('/login');
    });
});

router.get('/canvas', LOCKER.isSessionAvailable, (req, res) => {
    res.render("canvas", {current_view: "canvas"});
});

module.exports = router;
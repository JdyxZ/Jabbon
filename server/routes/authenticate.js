/***************** AUTHENTICATE ROUTES *****************/

// External modules
const express = require('express');
const passport = require("passport");
const router = express.Router();

// Our modules
const LOCKER = require("../utils/locker.js");

// Get routes
router.get('/', (req, res) => {
    res.render("login");
});

router.get('/login', LOCKER.isSessionNotAvailable, (req, res) => { 
    res.render("login");
});

router.get('/signup', LOCKER.isSessionNotAvailable, (req, res) => { 
    res.render("signup");
});

router.get('/canvas', LOCKER.isSessionAvailable, (req, res) => {
    res.render("canvas");
});

router.get('/logout', LOCKER.isSessionAvailable, (req, res, next) => {
    req.logout(function(err) {
        if (err) return next(err);
        res.redirect('/login');
    });
});

// Post routes
router.post('/signup', LOCKER.isSessionNotAvailable, passport.authenticate("signup", {
    successRedirect: "/canvas",
    failureRedirect: "/signup",
    failureFlash: true
}));

router.post('/login', LOCKER.isSessionNotAvailable, passport.authenticate("login", {
    successRedirect: "/canvas",
    failureRedirect: "/login",
    failureFlash: true
}));

// Export module
module.exports = router;
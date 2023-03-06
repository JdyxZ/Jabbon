/***************** AUTHENTICATE ROUTES *****************/

// External modules
const express = require('express');
const passport = require("passport");
const router = express.Router();

// Our modules
const LOCKER = require("../session/locker.js");

// Main routes
router.get('/', LOCKER.isSessionNotAvailable, (req, res) => {
    res.render("login");
});

router.get('/login', LOCKER.isSessionNotAvailable, (req, res) => { 
    res.render("login");
});

router.get('/signup', LOCKER.isSessionNotAvailable, (req, res) => { 
    res.render("signup");
});

router.get('/logout', LOCKER.isSessionAvailable, (req, res, next) => {
    req.logout(function(err) {
        if (err) return next(err);
        res.redirect('/login');
    });
});

// Local strategy
router.post('/signup', LOCKER.isSessionNotAvailable, passport.authenticate("local_signup", {
    successRedirect: "/canvas",
    failureRedirect: "/signup",
    failureFlash: true
}));

router.post('/login', LOCKER.isSessionNotAvailable, passport.authenticate("local_login", {
    successRedirect: "/canvas",
    failureRedirect: "/login",
    failureFlash: true
}));

// Google strategy
router.post('auth/google', LOCKER.isSessionNotAvailable, passport.authenticate("google", {
   scope: ['profile'] 
}))

router.get('auth/google/callback', LOCKER.isSessionNotAvailable, passport.authenticate("google", {
    successRedirect: "/canvas",
    failureRedirect: "/login",
    failureFlash: true
}))

// Export module
module.exports = router;
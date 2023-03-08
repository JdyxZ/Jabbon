/***************** AUTHENTICATE ROUTES *****************/

// External modules
const express = require('express');
const passport = require("passport");
const router = express.Router();

// Our modules
const LOCKER = require("../utils/locker.js");

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
router.post('/auth/google', LOCKER.isSessionNotAvailable, passport.authenticate("google", {
    failureRedirect: "/"
}));

router.get('/auth/google/callback', LOCKER.isSessionNotAvailable, passport.authenticate("google", {
    successRedirect: "/canvas",
    failureRedirect: "/login",
    failureFlash: true
}));

// Twitch strategy
router.post('/auth/twitch', LOCKER.isSessionNotAvailable, passport.authenticate("twitch", {
    failureRedirect: "/"
}));
 
router.get('/auth/twitch/callback', LOCKER.isSessionNotAvailable, passport.authenticate("twitch", {
    successRedirect: "/canvas",
    failureRedirect: "/login",
    failureFlash: true
}));

 // Github strategy
router.post('/auth/github', LOCKER.isSessionNotAvailable, passport.authenticate("github", {
    failureRedirect: "/"
}));
 
router.get('/auth/github/callback', LOCKER.isSessionNotAvailable, passport.authenticate("github", {
    successRedirect: "/canvas",
    failureRedirect: "/login",
    failureFlash: true
}));

// Discord strategy
router.post('/auth/discord', LOCKER.isSessionNotAvailable, passport.authenticate("discord", {
    failureRedirect: "/"
}));
 
router.get('/auth/discord/callback', LOCKER.isSessionNotAvailable, passport.authenticate("discord", {
    successRedirect: "/canvas",
    failureRedirect: "/login",
    failureFlash: true
}));

// Twitter strategy
router.post('/auth/twitter', LOCKER.isSessionNotAvailable, passport.authenticate("twitter", {
    failureRedirect: "/" 
}));
 
router.get('/auth/twitter/callback', LOCKER.isSessionNotAvailable, passport.authenticate("twitter", {
    successRedirect: "/canvas",
    failureRedirect: "/login",
    failureFlash: true
}));

// Facebook strategy
router.post('/auth/facebook', LOCKER.isSessionNotAvailable, passport.authenticate("facebook", {
    failureRedirect: "/"
}));
 
router.get('/auth/facebook/callback', LOCKER.isSessionNotAvailable, passport.authenticate("facebook", {
    successRedirect: "/canvas",
    failureRedirect: "/login",
    failureFlash: true
}));

// Export module
module.exports = router;
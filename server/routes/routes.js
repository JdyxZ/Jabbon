// External modules
const express = require('express');
const passport = require("passport");
const router = express.Router();

// Our modules
const SERVER = require("../server.js");
const DATABASE = require("../database/database.js");
const LOCKER = require("../utils/locker.js");

// Get routes
router.get('/', (req, res) => {
    res.render("login");
});

router.get('/login', LOCKER.isNotLogged, (req, res) => {
    res.render("login");
});

router.get('/signup', LOCKER.isNotLogged, (req, res) => {
    res.render("signup");
});

router.get('/canvas', LOCKER.isLogged, (req, res) => {
    
    // Get user id from session
    const user_id = req.session.passport.user;

    // Check if user is already connected in a different window
    if(Object.keys(SERVER.clients).includes(user_id.toString()))
        res.redirect("/logout");

    // Otherwise, print canvas
    res.render("canvas");
});

router.get('/logout', LOCKER.isLogged, (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

// Post routes
router.post('/signup', LOCKER.isNotLogged, passport.authenticate("signup", {
    successRedirect: "/canvas",
    failureRedirect: "/signup",
    failureFlash: true
}));

router.post('/login', LOCKER.isNotLogged, passport.authenticate("login", {
    successRedirect: "/canvas",
    failureRedirect: "/login",
    failureFlash: true
}));

// Util routes
router.get('/get_world', function(req, res){ // Model info
    res.end(SERVER.world.toJSON());
});

router.get('/update_world', async function(req, res){ // Model update
    const [status, result] = await DATABASE.updateModel(SERVER.world);

    switch(status)
    {
        case("OK"):
            res.end("Model updated");
            break;
        case("ERROR"):
            res.end(result);
            break;
    }
});

router.get('/rooms', function(req, res){ // Model info
    res.end(JSON.stringify(SERVER.world.rooms, null, 2));
});

router.get('/user/:id', async function(req,res) { // User info
    const [status, result] = await DATABASE.fetchUser(req.params.id);

    switch(status)
    {
        case("OK"):
            res.end(JSON.stringify(result[0], null, 2));
            break;
        case("ERROR"):
            res.end(result);
            break;
    }
});

router.get('/users', function(req, res){ // Users info
    res.end(JSON.stringify(SERVER.world.users, null, 2));
});

router.post('/user', async function(req,res){ // User insert
    const [status, result] = await DATABASE.pushUser(req.body);

    switch(type)
    {
        case("OK"):
            res.end(`User ${req.body.name} successfully inserted`);
            break;
        case("ERROR"):
            res.end(result);
            break;
    }
});

router.put('/user', async function(req, res){ // User update
    const [status, result] = await DATABASE.updateUser(req.body);

    switch(type)
    {
        case("OK"):
            res.end(result[0].affectedRows <= 0 ? `User ${req.body.name} has not been found in the database` : `User ${req.body.name} successfully updated`);
            break;
        case("ERROR"):
            res.end(result);
            break;
    }
});

router.delete('/user/:id', async function(req, res){ // User delete
    const [status, result] = await DATABASE.removeUser(req.params.id);
    
    switch(status)
    {
        case("OK"):
            res.end(result[0].affectedRows <= 0 ? `User ${req.body.name} has not been found in the database` : `User ${req.body.name} successfully removed`);
            break;
        case("ERROR"):
            res.end(result);
            break;
    }
});

router.get("/clients", (req,res,next) => {
    res.end(JSON.stringify(Object.keys(SERVER.clients)));
});

// Export module
module.exports = router;
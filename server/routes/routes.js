// Import
const SERVER = require("../server.js");
const DATABASE = require("../database/database.js");
const express = require('express');
const router = express.Router();

// Get routes
router.get('/', (req, res) => {
    res.render("../views/login");
});

router.get('/login', (req, res) => {
    res.render("../views/login");
});

router.get('/signup',  (req, res) => {
    res.render("../views/signup");
});

router.get('/canvas', (req, res) => {
    res.render("../views/canvas");
});

// Post routes
router.post('/signup', function(req, res){ // User signin
    console.log(req.body);
    res.end("Sigin request received");
});

router.post('/login', function(req, res){ // User login 
    console.log(req.body);
    res.end("Login request received");
});

// Util routes
router.get('/user/:id', function(req,res) { // User info
    const result = DATABASE.fetchUser(req.params.id);
    res.end(result);
});

router.get('/users', function(req, res){ // Users info
    const result = DATABASE.fetchUsers();
    res.end(result);
})

router.post('/user', function(req,res){ // User insert
    const result = DATABASE.pushUser(req.body);
    res.end(result);
})

router.put('/user', function(req, res){ // User update
    const result = DATABASE.updateUser(req.body);
    res.end(result);
});

router.delete('/user/:id', function(req, res){ // User delete
    const result = DATABASE.removeUser(req.params.id);
    res.end(result);
});

// Export module
module.exports = router;
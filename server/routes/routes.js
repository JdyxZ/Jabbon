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
router.get('/get_world', async function(req, res){ // Model info
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

router.get('/rooms', async function(req, res){ // Model info
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

router.get('/users', async function(req, res){ // Users info
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

// Export module
module.exports = router;
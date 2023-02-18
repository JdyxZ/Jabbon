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
router.get('/user/:id', async function(req,res) { // User info
    const {type, content} = await DATABASE.fetchUser(req.params.id);

    switch(type)
    {
        case("OK"):
            res.end(JSON.stringify(content[0], null, 2));
            break;
        case("ERROR"):
            res.end(content);
            break;
    }
});

router.get('/users', async function(req, res){ // Users info
    const {type, content} = await DATABASE.fetchUsers();
    
    switch(type)
    {
        case("OK"):
            res.end(JSON.stringify(content[0], null, 2));
            break;
        case("ERROR"):
            res.end(content);
            break;
    }
})

router.post('/user', async function(req,res){ // User insert
    console.log(req.body);
    const {type, content} = await DATABASE.pushUser(req.body);

    switch(type)
    {
        case("OK"):
            res.end(`User ${req.body.name} successfully inserted`);
            break;
        case("ERROR"):
            res.end(content);
            break;
    }
})

router.put('/user', async function(req, res){ // User update
    const {type, content} = await DATABASE.updateUser(req.body);

    switch(type)
    {
        case("OK"):
            const [result] = content;
            res.end(result.affectedRows <= 0 ? `User ${req.body.name} has not been found in the database` : `User ${req.body.name} successfully updated`);
            break;
        case("ERROR"):
            res.end(content);
            break;
    }
});

router.delete('/user/:id', async function(req, res){ // User delete
    const {type, content} = await DATABASE.removeUser(req.params.id);
    
    switch(type)
    {
        case("OK"):
            const [result] = content;
            res.end(result.affectedRows <= 0 ? `User ${req.body.name} has not been found in the database` : `User ${req.body.name} successfully removed`);
            break;
        case("ERROR"):
            res.end(content);
            break;
    }
});

// Export module
module.exports = router;
// Import
const SERVER = require("../server.js");
const express = require('express');
const router = express.Router();

// Routes
router.get('/', async (req, res) => {
  res.render("../views/index");
})

router.get('/user', SERVER.getUser);

router.post('/sigin', async function(req, res){ // User signin
  SERVER.signin(req.body);
  res.end("Sigin request received");
});

router.post('/login', async function(req, res){ // User login
  SERVER.login(req.body);
  res.end("Login request received");
});

router.put('/user', async function(req, res){ // User update
  SERVER.updateUser(req.body);
  res.end("User update request received");
});

router.delete('/user', async function(req, res){ // User delete
  SERVER.deleteUser(req.body);
  res.end("User delete request received");
});

module.exports = router;
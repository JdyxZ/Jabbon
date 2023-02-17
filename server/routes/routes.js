// Import
const SERVER = require("../server.js");
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
  //SERVER.signup(req.body);
  console.log(req.body);
  res.end("Sigin request received");
});

router.post('/login', function(req, res){ // User login 
  //SERVER.login(req.body);
  console.log(req.body);
  res.end("Login request received");
});

// Util routes

router.get('/user', SERVER.getUser);

router.put('/user', function(req, res){ // User update
  SERVER.updateUser(req.body);
  res.end("User update request received");
});

router.delete('/user', function(req, res){ // User delete
  SERVER.deleteUser(req.body);
  res.end("User delete request received");
});

module.exports = router;
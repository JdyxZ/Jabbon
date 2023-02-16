// Import
const SERVER = require("../server.js");
const express = require('express');
const router = express.Router();

// Get routes
router.get('/', async (req, res) => {
  res.render("../views/login");
});

router.get('/login', async (req, res) => {
  res.render("../views/login");
});

router.get('/signup', async (req, res) => {
  res.render("../views/signup");
});

router.get('/canvas', async (req, res) => {
  res.render("../views/canvas");
});

// Post routes
router.post('/signup', async function(req, res){ // User signin
  //SERVER.signup(req.body);
  console.log(req.body);
  res.end("Sigin request received");
});

router.post('/login', async function(req, res){ // User login
  //SERVER.login(req.body);
  console.log(req.body.type);
  if(req.body.type == "signup")
  {
    res.render("../views/signup");
  } 
  else 
  {
    res.end("Login request received");
  }
});

// Util routes

router.get('/user', SERVER.getUser);

router.put('/user', async function(req, res){ // User update
  SERVER.updateUser(req.body);
  res.end("User update request received");
});

router.delete('/user', async function(req, res){ // User delete
  SERVER.deleteUser(req.body);
  res.end("User delete request received");
});

module.exports = router;
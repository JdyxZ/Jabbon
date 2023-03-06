/***************** APP ROUTES *****************/

// External modules
const express = require('express');
const router = express.Router();

// Our modules
const LOCKER = require("../session/locker.js");

router.get('/canvas', LOCKER.isSessionAvailable, (req, res) => {
    res.render("canvas");
});
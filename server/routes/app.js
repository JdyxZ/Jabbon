/***************** APP ROUTES *****************/

// External modules
const express = require('express');
const router = express.Router();

// Our modules
const LOCKER = require("../utils/locker.js");

router.get('/canvas', LOCKER.isSessionAvailable, (req, res) => {
    res.render("canvas", {current_view: "canvas"});
});

module.exports = router;
/***************** TWITCH STRATEGY *****************/

// External modules
const passport = require('passport');
const TwitchStrategy = require('passport-twitch').Strategy;

// Our modules
const {WORLD} = require("../../model/model.js");
const DATABASE = require("../../database/database.js");
const CRYPTO = require("../../utils/crypto.js");
const LOCKER = require("../../session/locker.js");
const OAUTH_CREDENTIALS = require('../../config/oauth_credentials.js');

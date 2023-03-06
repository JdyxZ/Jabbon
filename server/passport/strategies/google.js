/***************** GOOGLE STRATEGY *****************/

npm install passport-github2 passport-facebook passport-twitter passport-google-oauth20 passport-twitch

// External modules
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Our modules
const {WORLD} = require("../../model/model.js");
const DATABASE = require("../../database/database.js");
const CRYPTO = require("../../utils/crypto.js");
const LOCKER = require("../../session/locker.js");
const OAUTH_CREDENTIALS = require('../../config/oauth_credentials.js');



/***************** STRATEGIES *****************/

// External modules
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const TwitchStrategy = require('passport-twitch').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

// Our modules
const LOCKER = require("../session/locker.js");
const OAUTH_CREDENTIALS = require('../config/oauth_credentials.js');
const {LOCAL_VERIFICATION, SOCIAL_VERIFICATION} = require("./verifications.js");

/***************** LOCAL STRATEGY *****************/

passport.use('local_signup', new LocalStrategy(
{
    usernameField: 'name',
    passwordField: 'password',
    passReqToCallback: true
},
LOCAL_VERIFICATION.signup));
    
passport.use('local_login', new LocalStrategy(
{
    usernameField: 'name',
    passwordField: 'password',
    passReqToCallback: true
}, 
LOCAL_VERIFICATION.login));

/***************** GOOGLE STRATEGY *****************/

passport.use(new GoogleStrategy(
{
    clientID: OAUTH_CREDENTIALS.google.ID,
    clientSecret: OAUTH_CREDENTIALS.google.secret,
    callbackURL: '/auth/google/callback'
},
SOCIAL_VERIFICATION.process));


/***************** FACEBOOK STRATEGY *****************/


/***************** GITHUB STRATEGY *****************/


/***************** TWITCH STRATEGY *****************/


/***************** TWITTER STRATEGY *****************/
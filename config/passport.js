const jwtStrategy = require('passport-jwt').Strategy;
const ExctractJWT = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const key = require('./keys').secretOrPrivateKey;

const opts = {};

//jwtFromRequest is a function that accepts all the request as it's paramater and returns a JWT token as a string or null. To enable this function to accept all the requests, we have to initialise passport, use it as middleware in main file and then return a middleware with a new strategy here which returns whatever we return.
opts.jwtFromRequest = ExctractJWT.fromAuthHeaderAsBearerToken(); 
opts.secretOrKey = key;

module.exports = (passport) => {
    passport.use(new jwtStrategy(opts, (jwt_payload,done) => {
        User.findById(jwt_payload.id)
        .then(user => {
            if(user)
            return done(null, user);
            else
            return done(null, false);
        }).catch(err => console.log("error is "+err))
    })
)}



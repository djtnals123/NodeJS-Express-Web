var local_login = require('./passport/local_login');
var local_signup = require('./passport/local_signup');

module.exports = function(app, passport){
    passport.serializeUser(function(user, done){
        done(null, user);
    });
    passport.deserializeUser(function(user, done){
        done(null, user);
    });
        
    passport.use('local-login', local_login);
    passport.use('local-signup', local_signup);
}
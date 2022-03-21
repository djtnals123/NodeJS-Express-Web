var localStrategy = require('passport-local').Strategy;

module.exports = new localStrategy({
    usernameField:'id',
    passwordField:'pw',
    passReqToCallback:true
},  async function(req, id, password, done){
        var database = req.app.get('database');
        const user = await database.AccountModel.findById(id);
        if(!user){
            return done(null, false, req.flash('loginMessage', '등록된 계정이 없습니다.'));
        }
        var authenticated = user.authenticate(password, user._doc.salt, user._doc.hashed_password);
        if(authenticated){
            return done(null, user);
        }
        else {
            return done(null, false, req.flash('loginMessage', '비밀번호가 일치하지 않습니다.'));
        }
    }
);


module.exports = function(app, passport){
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/choose_function',
        failureRedirect: '/login',
        failureFlash: true
    }));
    // app.post('/account/registertt', function(req, res, next) {
    //     passport.authenticate('local-signup', function(error, user, info) {
    //         console.log(info);
    //         if(error) {
    //             return res.status(500).json(error);
    //         }
    //         if(!user) {
    //             return res.status(401).json(info);
    //         }
    //         return res.json('/choose_function');
            
    //     })(req, res, next);
    // });
}
var express = require('express');
var common  = require('./common');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(common.authentication(req,res))
    res.redirect('/choose_function');
  else
  res.redirect('/login');
});

router.get('/login', function(req, res, next) {
  res.render('login_form', { msg: req.flash('loginMessage'), csrfToken: req.csrfToken() });
});

router.route('/logout').get(function(req, res){
    if(req.user)
        req.logOut();
    res.redirect('/');
});

router.get('/choose_function', function(req, res, next) {
  var msg = req.flash('msg');
  if(common.authentication(req,res)){
    res.render('choose_function_form', {msg, user:req.user});

  }
});

module.exports = router;

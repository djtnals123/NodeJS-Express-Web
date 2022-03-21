var express = require('express');
var router = express.Router();
var services = require('../container/service-container');
var common  = require('./common');

router.get('/agree', function(req, res, next) {
    res.render('account/agree', {csrfToken: req.csrfToken()});
});

router.post('/agree', function(req, res, next) {
    if(req.body.agree == 'on')
        res.redirect('/account/register?agree=on');
    else
        res.render('account/agree', {msg:'동의해주세요.', csrfToken: req.csrfToken()});
});

router.get('/register', function(req, res, next) {
    if(req.query.agree == "on")
        res.render('account/join_form', {modify:false, csrfToken: req.csrfToken()});
    else res.redirect('/account/agree');
});
router.post('/register', async function(req, res, next) {
    var dto = {id: req.body.id,
        password: req.body.pw, 
        confirmPw: req.body.confirm_pw,
        email: req.body.email, 
        name: req.body.name,
        hospital: req.body.hospital,
        auth: req.body.roles};
    var result = await services.accountService.register(dto);
    if(result.status == 201)
        res.json('/login');
    else
        res.status(result.status).json(result.msg);
});

router.get('/modify', async function(req, res, next) {
    if(common.authentication(req,res)){
        console.log(services.accountService);
        result = await services.accountService.getUserInfo(req.user.id);
        if(result.status == 200){
            res.render('account/join_form', {modify:result.user, csrfToken: req.csrfToken()});
        }
    }
});
router.post('/modify', async function(req, res, next) {
    if(common.authenticationAjax(req,res)){
        var dto = {password: req.body.pw,
            confirmPw: req.body.confirm_pw,
            email: req.body.email, 
            name: req.body.name,
            hospital: req.body.hospital,
            auth: req.body.roles};
        var result = await services.accountService.modify(req.user.id, dto);
        console.log(result.user);
        if(result.status == 200){
            req.user.auth = result.user.auth;
            res.json('/choose_function');
        }
        else
            res.status(result.status).json(result.msg);
    }
});

module.exports = router;
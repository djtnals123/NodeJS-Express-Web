var express = require('express');
var router = express.Router();
var services = require('../container/service-container');
var common  = require('./common');
var criteria = require('../dto/criteria');

router.get('/user_list', async function(req, res, next) {
    if(common.hasRole(req,res,'ROLE_ADMIN')){
        var cri = new criteria(req.query.page, req.query.perPage);
        var result = await services.adminService.userList(cri);
        if(result.status == 500)
            res.redirect('/choose_function');
        else 
            res.render('admin/user_list', Object.assign(result, {user:req.user}));
    }
});
module.exports = router;

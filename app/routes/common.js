var common = {}

common.authenticationAjax = function(req, res){
    if(req.user) 
        return true;
    else {
        res.json('/login');
        return false;
    }
}
common.authentication = function(req, res){
    if(req.user) 
        return true;
    else {
        res.redirect('/login');
        return false;
    }
}

common.hasRole = function(req, res, roles){
    if(this.authentication(req, res)){
        var hasRole = false

        if(Array.isArray(roles)){
            for(var item of roles){
                if(req.user.auth.includes(item)){
                    hasRole = true;
                    break;
                }
            }
        }
        else {
            if(req.user.auth.includes(roles))
                hasRole = true;
        }
        if(hasRole)
            return true;
        else {
            req.flash('msg', '권한이 없습니다.');
            res.redirect('/choose_function');
            return false;
        }
    }
    else return false;
}
common.hasRoleAjax = function(req, res, roles){
    if(this.authenticationAjax(req, res)){
        var hasRole = false

        if(Array.isArray(roles)){
            for(var item of roles){
                if(req.user.auth.includes(item)){
                    hasRole = true;
                    break;
                }
            }
        }
        else {
            if(req.user.auth.includes(roles))
                hasRole = true;
        }
        if(hasRole)
            return true;
        else {
            req.flash('msg', '권한이 없습니다.');
            res.json('/choose_function');
            return false;
        }
    }
    else return false;
}

module.exports = common;
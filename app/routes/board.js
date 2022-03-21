var express = require('express');
var common  = require('./common');
var utils = require('../utils');
var criteria = require('../dto/criteria');

var router = express.Router();
var fs  = require('fs');


var services = require('../container/service-container');

router.get('/list', async function(req, res, next) {
    if(common.hasRole(req,res,['ROLE_DOCTOR','ROLE_ADMIN'])){
        var cri = new criteria(req.query.page, req.query.perPage, req.query.option, req.query.keyword);
        var result = await services.boardService.list(cri);
        if(result.status == 401)
            res.redirect('/choose_function');
        else 
            res.render('board/board_list', Object.assign(result, {user:req.user}));
    }
});

router.get('/write', function(req, res, next) {
    if(common.hasRole(req,res,['ROLE_DOCTOR','ROLE_ADMIN']))
        res.render('board/board_write', {user:req.user, modify:false, csrfToken: req.csrfToken()});
});
router.post('/write', utils.upload.single('attachment'), async function(req, res, next) {
    console.log('cje');
    if(common.hasRoleAjax(req,res,['ROLE_DOCTOR','ROLE_ADMIN'])){
        var dto = { title:req.body.title,
                    writer:req.user.id,
                    content:req.body.content};
        if(req.file) 
            dto.attachment = req.file.filename 
            
        var result = await services.boardService.write(dto);

        if(result.status == 201) {
            res.json('/board/read?bid=' + result.board.board_id);
            return
        }
        else {
            res.status(result.status).json(result.msg);
        }
    }

    if(req.file){
        fs.unlink('D:/upload/' + req.file.filename, function(err){
            console.log(err);
        });
    }
});

router.get('/read', async function(req, res, next) {
    if(common.hasRole(req,res,['ROLE_DOCTOR','ROLE_ADMIN'])){
        board = await services.boardService.read(req.query.bid);
        if(board.status == 200)
            res.render('board/board_read', Object.assign(board, {user:req.user}));
        else 
            res.redirect('/board/list');
    }
});

router.get('/modify', async function(req, res, next) {
    if(common.hasRole(req,res,['ROLE_DOCTOR','ROLE_ADMIN'])){
        result = await services.boardService.read(req.query.bid);

        if(result.status == 200){
            if(result.board.writer == req.user.id)
                res.render('board/board_write', {user:req.user, modify:result.board, csrfToken: req.csrfToken()});
            else
                res.redirect('/board/read?bid=' + req.query.bid);
        }
        else 
            res.redirect('/board/list');
    }
});
router.post('/modify', utils.upload.single('attachment'), async function(req, res, next) {
    if(common.hasRoleAjax(req,res,['ROLE_DOCTOR','ROLE_ADMIN'])){
        oldBoard = await services.boardService.read(req.body.bid);

        if(board.status == 200 ){
            if(oldBoard.board.writer == req.user.id){
                var dto = { title:req.body.title,
                            content:req.body.content};
                if(req.file) 
                    dto.attachment = req.file.filename 
                    
                var result = await services.boardService.modify(req.body.bid, dto); //
                if(result.status == 200){
                    res.json('/board/read?bid=' + req.body.bid);
                    if(req.file){
                        fs.unlink('D:/upload/' + oldBoard.board.attachment, function(err){
                            console.log(err);
                        });
                    }
                    return;
                }
                else res.status(result.status).json(result.msg);
            }
            else res.status(oldBoard.status).json(oldBoard.msg);
        }
        else res.redirect('/board/list');
    }
    
    if(req.file){
        fs.unlink('D:/upload/' + req.file.filename, function(err){
            console.log(err);
        });
    }
});


router.get('/delete', async function(req, res, next) {
    if(common.hasRole(req,res,['ROLE_DOCTOR','ROLE_ADMIN'])){
        board = await services.boardService.read(req.query.bid);

        if(board.status == 200) {
            if(board.board.writer == req.user.id) {
                result = await services.boardService.delete(req.query.bid);
                if(result.status == 200)
                    res.redirect('/board/list');
                else
                    res.redirect('/board/read?bid=' + req.query.bid)
            }
            else res.redirect('/board/read?bid=' + req.query.bid);
        }
        else res.redirect('/board/list');
    }
});


module.exports = router;
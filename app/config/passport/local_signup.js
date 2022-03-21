var localStrategy = require('passport-local').Strategy;
var regexes = require('../../utils').regexes;


module.exports = new localStrategy({
    usernameField:'id',
    passwordField:'pw',
    passReqToCallback:true
},  async function(req, id, pw, done) {
    console.log('dddㅇd');
    var confirmPw = req.body.confirm_pw;
    var email = req.body.email;
    var name = req.body.name;
    var hospital = req.body.hospital;
    var roles = req.body.roles;
    var database = req.app.get('database');
    const user = await database.AccountModel.findById(id);
    if(user){
        console.log('dddㅇ');
        return done(null, false, '이미 존재하는 아이디입니다.');
    } else if(!regexes.regexNumOrEng.test(id)) {
        return done(null, false, 'ID는 영문 또는 숫자만 가능합니다.');
    } else if(!regexes.regexIdLength.test(id)){
        return done(null, false, '비밀번호는 영문, 숫자, 특수문자를 조합한 8자리 이상만 허용합니다.');
    } else if(pw != confirmPw){
        return done(null, false, '비밀번호와 비밀번호확인이 일치하지 않습니다.');
    } else if(!regexes.regexEmail.test(email)){
        return done(null, false, '유효하지않는 이메일 형식입니다.');
    } else if(email.length > 50){
        return done(null, false, '이메일은 최대 50글자까지 가능합니다.');
    } else if(name.length == 0){
        return done(null, false, '이름을 입력해주세요.');
    } else if(name.length > 25){
        return done(null, false, '이름은 최대 25글자까지 가능합니다.');
    } else if(!hospital){
        return done(null, false, '병원을 선택해 주세요.');
    } else if(!roles){
        return done(null, false, '회원형태를 선택해 주세요.');
    }
    else{
        var convertedRoles = [];
        if(!Array.isArray(roles))
            roles = [roles];
        roles.forEach(element => {
            if(element == "1")
                convertedRoles.push("ROLE_PATIENT");
            else if(element == "2")
                convertedRoles.push("ROLE_DOCTOR");
        });
        

        try{
            const newUser = await database.AccountModel.insert({id, password:pw, email, name, hospital, auth:convertedRoles});
            return done(null, newUser);
        }
        catch(err){
            console.log(err);
            return done(null, false, '사용자 정보 저장 시 에러가 발생했습니다.');
        }
    }
});
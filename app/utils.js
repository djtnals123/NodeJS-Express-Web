var multer  = require('multer');
const utils = {}

utils.utcToYYYYMMDD = function(utc){
    var year = utc.getFullYear();
    var month = ('0' + (utc.getMonth() + 1)).slice(-2);
    var day = ('0' + utc.getDate()).slice(-2);
    var newDate = year + '-' + month + '-' + day;
    return newDate;
}

const uuidv4 = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'D:/upload'); //파일 저장 경로
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}_${file.originalname}`); //파일 이름
    }
});
utils.upload = multer({ storage : storage, limits: { fileSize: 10 * 1024 * 1024 } });

utils.convertRoles = function(roles){
    for(var key in roles){
        roles[key] = roles[key].replace('ROLE_PATIENT', '환자');
        roles[key] = roles[key].replace('ROLE_DOCTOR', '의사');
        roles[key] = roles[key].replace('ROLE_ADMIN', '관리자');
    }
}
utils.convertHospital = function(hospital){
    return hospital.replace('S', '서울대병원').replace('K', '고려대병원');
}

utils.regexes = {
    regexNumOrEng : /^[a-zA-Z0-9]*$/, // 영문 숫자만 허용
    regexIdLength : /^.{8,30}$/, // ID길이 체크
    regexPassword : /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/, // 비밀번호
    regexEmail : /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/ // email
};


module.exports = utils;
var express = require('express');
var router = express.Router();
var common  = require('./common');

var fs = require('fs');
var path = require('path');
var mime = require('mime');

router.get('/:file_name', function(req, res, next) {
  if(common.hasRole(req,res,['ROLE_DOCTOR','ROLE_ADMIN'])){

    var upload_folder = 'D:/upload/';
    var file = upload_folder + req.params.file_name; // ex) /upload/files/sample.txt
    
    try {
      if (fs.existsSync(file)) { // 파일이 존재하는지 체크
        var filename = path.basename(file); // 파일 경로에서 파일명(확장자포함)만 추출
        var mimetype = mime.getType(file); // 파일의 타입(형식)을 가져옴
      
        res.setHeader('Content-disposition', 'attachment; filename=' + getDownloadFilename(req, filename)); // 다운받아질 파일명 설정
        res.setHeader('Content-type', mimetype); // 파일 형식 지정
      
        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
      } else {
        res.send('해당 파일이 없습니다.');  
        return;
      }
    } catch (err) { 
      console.log(err);
      res.send('파일을 다운로드하는 중에 에러가 발생하였습니다.');
      return;
    }
  }
});

var iconvLite = require('iconv-lite');
function getDownloadFilename(req, filename) {
  var header = req.headers['user-agent'];

  filename = filename.substring(37);
  if (header.includes("MSIE") || header.includes("Trident")) { 
      return encodeURIComponent(filename).replace(/\\+/gi, "%20");
  } else if (header.includes("Chrome")) {
      return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
  } else if (header.includes("Opera")) {
      return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
  } else if (header.includes("Firefox")) {
      return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
  }

  return filename;
}

module.exports = router;
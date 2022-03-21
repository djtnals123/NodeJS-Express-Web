
class Service {
    #model;
    #regexes;

    constructor(){
        this.#model = require('../container/db-container').AccountModel;
        this.#regexes = require('../utils').regexes;
    }

    async getUserInfo(id){
        try{
            const user = await this.#model.findById(id);
            return {status:200, user};

        }
        catch(err){
            console.log(err);
            return {status:500, msg:'유저조회 오류'};
        }
    }

    async register(dto) {
        var result = await this.validation(dto, false);

        if(result){
            return result;
        } else {
            this.convertRoles(dto);
            delete dto.confirmPw;
            
            try{
                const newUser = await this.#model.insert(dto);
                return {status:201, user: newUser};
            }
            catch(err){
                console.log(err);
                return {status:500, msg: '사용자 정보 저장 시 에러가 발생했습니다.'};
            }
        }
    }

    async modify(id, dto){
        var result = await this.validation(dto, true);
        if(result) {
            return result;
        } else{
            this.convertRoles(dto);
            delete dto.confirmPw;
            try{
                const user = await this.#model.updateOneById(id, dto);
                return {status:200, user};
            }
            catch(err){
                console.log(err);
                return {status:500, msg:'게시글 수정 오류'};
            }
        }
    }

    async validation(dto, isModify){
        var result = null;
        if(!isModify){
            const user = await this.#model.findById(dto.id);
            if(user){
                result = {status:401, msg: '이미 존재하는 아이디입니다.'};
            } else if(!this.#regexes.regexNumOrEng.test(dto.id)) {
                result = {status:401, msg: 'ID는 영문 또는 숫자만 가능합니다.'};
            } else if(!this.#regexes.regexIdLength.test(dto.id)){
                result = {status:401, msg: 'ID는 8글자이상 30글자 이하만 허용합니다.'};
            }
        }
        if(!result){
            if(!this.#regexes.regexPassword.test(dto.password)){
                result = {status:401, msg: '비밀번호는 영문, 숫자, 특수문자를 조합한 8자리 이상만 허용합니다.'};
            } else if(dto.password != dto.confirmPw){
                result = {status:401, msg: '비밀번호와 비밀번호확인이 일치하지 않습니다.'};
            } else if(!this.#regexes.regexEmail.test(dto.email)){
                result = {status:401, msg: '유효하지않는 이메일 형식입니다.'};
            } else if(dto.email.length > 50){
                result = {status:401, msg: '이메일은 최대 50글자까지 가능합니다.'};
            } else if(dto.name.length == 0){
                result = {status:401, msg: '이름을 입력해주세요.'};
            } else if(dto.name.length > 25){
                result = {status:401, msg: '이름은 최대 25글자까지 가능합니다.'};
            } else if(!dto.hospital){
                result = {status:401, msg: '병원을 선택해 주세요.'};
            } else if(!dto.auth){
                result = {status:401, msg: '회원형태를 선택해 주세요.'};
            }  
        }
        return result;
    }

    convertRoles(dto){
        var convertedRoles = [];
        if(!Array.isArray(dto.auth))
            dto.auth = [dto.auth];
        dto.auth.forEach(element => {
            if(element == "1")
                convertedRoles.push("ROLE_PATIENT");
            else if(element == "2")
                convertedRoles.push("ROLE_DOCTOR");
        });
        dto.auth = convertedRoles;
    }
}



module.exports = Service;
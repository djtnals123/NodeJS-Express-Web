
const pageMaker = require('../dto/page-maker');
const utils = require('../utils');
class Service {
    #model;

    constructor(){
        this.#model = require('../container/db-container').AccountModel;
    }

    async userList(criteria){
        try{
            const userList = await this.#model.findList(criteria);
            for(var item of userList){
                var newDate = utils.utcToYYYYMMDD(item.created_date);
                item.new_created_date = newDate;
                utils.convertRoles(item.auth);
                item.hospital = utils.convertHospital(item.hospital);
            }
            const count = await this.#model.count();
            const pm = pageMaker(criteria.page, criteria.perPage, count);
            return {status:200, userList, pm, criteria};

        }
        catch(err){
            console.log(err);
            return {status:500, msg:'유저조회 오류'};
        }
    }
}

module.exports = Service;
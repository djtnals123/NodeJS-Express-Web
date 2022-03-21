var fs  = require('fs');
const pageMaker = require('../dto/page-maker');
const utils = require('../utils');

class Service {
    #model;

    constructor(){
        this.#model = require('../container/db-container').BoardModel;
    }

    async write(dto){
        if(dto.title.length == 0)
            return {status:401, msg:'제목을 입력해주세요.'};
        else if(dto.content.length == 0)
            return {status:401, msg:'내용을 입력해주세요.'};
        else {
            try{
                var board = await this.#model.insert(dto);
                return {status:201, board:board};
            }
            catch(err){
                console.log(err);
                return {status:500, msg:'게시글 작성 오류'};
            }
        }
    }

    #options = ['title', 'content', 'title+content', 'writer'];
    async list(criteria){
        try{
            var list, count;
            if(this.#options.includes(criteria.option) && criteria.keyword){
                if(criteria.option == 'title+content'){
                    const options = criteria.option.split('+');
                    list = await this.#model.findListByTwoOptions(criteria,options);
                    count = await this.#model.countByTwoOptions(criteria,options);
                } else {
                    list = await this.#model.findListByOption(criteria);
                    count = await this.#model.countByOption(criteria);
                }
            } else {
                list = await this.#model.findList(criteria);
                count = await this.#model.count();
            }
            const pm = pageMaker(criteria.page, criteria.perPage, count)
            
            for(var item of list){
                var newDate = utils.utcToYYYYMMDD(item.created_date);
                item.new_created_date = newDate;
            }
            return {list, pm, criteria};
        }
        catch(err){
            console.log(err);
            return {status:401, msg:'게시글목록 조회 오류'};
        }
    }
    
    async read(bid){
        try{
            const board = await this.#model.findOneByBoardId(bid);
            if(board){
                if(board.attachment){
                    board.originalFileName = board.attachment.substring(37);
                }
                return {status:200, board:board};
            }
            else return {status:401, msg:'게시글 없음'};
        }
        catch(err){
            console.log(err);
            return {status:500, msg:'게시글 조회 오류'};
        }
    }

    async modify(bid, dto){
        if(dto.title.length == 0)
            return {status:401, msg:'제목을 입력해주세요.'};
        else if(dto.content.length == 0)
            return {status:401, msg:'내용을 입력해주세요.'};
        else {
            try{
                await this.#model.updateOneByBoardId(bid, dto);
                return {status:200};
            }
            catch(err){
                console.log(err);
                return {status:500, msg:'게시글 수정 오류'};
            }
        }
    }

    async delete(bid){
        try{
            board = await this.#model.deleteOneByBoardId(bid);
            console.log(board);
            if(board.attachment){
                fs.unlink('D:/upload/' + board.attachment, function(err){
                    console.log(err);
                });
            }
            return {status:200};
        }
        catch(err){
            console.log(err);
            return {status:500, msg:'게시글 삭제 오류'};
        }
    }
}



module.exports = Service;
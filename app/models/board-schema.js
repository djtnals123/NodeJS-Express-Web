var Schema = {};
const moment = require('moment-timezone');


Schema.createSchema = function(mongoose) {
    var autoIncrement = require('mongoose-auto-increment');
    autoIncrement.initialize(mongoose.connection);

    var BoardSchema = mongoose.Schema({
        board_id: {type:Number, required:true, unique:true, 'default':1},
        title: {type:String, required:true },
        writer: {type:String, required:true },
        content: {type:String, required:true },
        attachment: {type:String, required:false },
        created_date: {type:Date, index:{unique:false}},
        updated_date: {type:Date, index:{unique:false}},
    });
    BoardSchema.plugin(autoIncrement.plugin, {
        model: 'boards',
        field: 'board_id',
        startAt: 1, //시작
        increment: 1 // 증가
    });


    BoardSchema.statics.insert = function(dto) {
        now = moment.tz(Date.now(), "Asia/Seoul");
        dto.created_date = now;
        dto.updated_date = now;
        return new this(dto).save();
    };
    BoardSchema.statics.findList = function(criteria){
        return this.find({})
            .sort({board_id:-1})
            .skip((criteria.page-1)*criteria.perPage)
            .limit(criteria.perPage)
            .exec();
    };
    BoardSchema.statics.count = function(){
        return this.countDocuments({}).exec();
    };
    BoardSchema.statics.findListByOption = function(criteria){
        var queryParam = {};
        queryParam[criteria.option] = { $regex: criteria.keyword, $options: "i" };
        return this.find(queryParam)
            .sort({board_id:-1})
            .skip((criteria.page-1)*criteria.perPage)
            .limit(criteria.perPage)
            .exec();
    };
    BoardSchema.statics.countByOption = function(criteria){
        var condition = {};
        condition[criteria.option] = { $regex: criteria.keyword, $options: "i" };
        return this.countDocuments(condition).exec();
    };

    BoardSchema.statics.findListByTwoOptions = function(criteria, options){
        var condition1 = {};
        var condition2 = {};
        condition1[options[0]] = { $regex: criteria.keyword, $options: "i" };
        condition2[options[1]] = { $regex: criteria.keyword, $options: "i" };
        return this.find({$or:[condition1, condition2]})
            .sort({board_id:-1})
            .skip((criteria.page-1)*criteria.perPage)
            .limit(criteria.perPage)
            .exec();
    };
    BoardSchema.statics.countByTwoOptions = function(criteria, options){
        var condition1 = {};
        var condition2 = {};
        condition1[options[0]] = { $regex: criteria.keyword, $options: "i" };
        condition2[options[1]] = { $regex: criteria.keyword, $options: "i" };
        return this.countDocuments({$or:[condition1, condition2]}).exec();
    };

    BoardSchema.statics.findOneByBoardId = function(bid){
        return this.findOne({board_id:bid}).exec();
    };
    BoardSchema.statics.updateOneByBoardId = function(bid, dto){
        return this.updateOne({ board_id: bid }, {$set: dto}).exec();
    };
    BoardSchema.statics.deleteOneByBoardId = function(bid){
        return this.findOneAndDelete({ board_id: bid });
    }

    return BoardSchema;
}

module.exports = Schema;
var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose) {
    var AccountSchema = mongoose.Schema({
        id: {type:String, required:true, unique:true, 'default':''},
        hashed_password: {type:String, index:'hased', 'default':''},
        email: {type:String, required:true, 'default':''},
        name: {type:String, required:true, 'default':''},
        hospital: {type:String, required:true, 'default':''},
        auth: {type:[String], required:true, 'default':''},
        salt: {type:String, required:true},
        created_date: {type:Date, index:{unique:false}, 'default':Date.now()},
        updated_date: {type:Date, index:{unique:false}, 'default':Date.now()},
    });
    AccountSchema.path('id').validate(function(id){
        return id.length;
    }, 'id 칼럼 값 없음');

    AccountSchema.virtual('password').
        set(function(password){
            this.salt = this.makeSalt();
            this.hashed_password = this.encryptPassword(password);
        });
    AccountSchema.method('encryptPassword',function(plainText, inSalt){
        if(inSalt){
            return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
        }
        else{
            return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
        }
    });
    AccountSchema.method('makeSalt', function(){
        return Math.round((new Date().valueOf() * Math.random())).toString();
    });
    AccountSchema.method('authenticate', function(plainText, inSalt, hashed_password){
        if(inSalt){
            return this.encryptPassword(plainText, inSalt) == hashed_password;
        }
        else{
            return this.encryptPassword(plainText) == hashed_password;
        }
    });
    AccountSchema.statics.findById = function(id){
        return this.findOne({id}).exec();
    };
    AccountSchema.statics.findList = function(criteria){
        return this.find({})
            .sort({_id:-1})
            .skip((criteria.page-1)*criteria.perPage)
            .limit(criteria.perPage)
            .exec();
    };
    AccountSchema.statics.count = function(){
        return this.countDocuments({}).exec();
    };

    AccountSchema.statics.insert = function(dto) {
        return new this(dto).save();
    };

    AccountSchema.statics.updateOneById = async function(id, dto){
        user = await this.findOne({id}).exec();
        user.password = dto.password;
        user.email = dto.email;
        user.name = dto.name;
        user.hospital = dto.hospital;
        user.auth = dto.auth;
        user.save();
        return user;
    };

    return AccountSchema;
}

module.exports = Schema;
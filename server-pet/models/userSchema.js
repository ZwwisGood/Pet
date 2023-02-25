const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    "userId": Number,//用户ID，自增长
    "userName": String,//用户名称
    "userPwd": String,//用户密码，md5加密
    "phone": String,//手机号
    //创建时间
    "createTime": {
        type: Date,
        default: Date.now
    },
    //更新时间
    "lastLoginTime": {
        type: Date,
        default: Date.now
    },
    // 头像
    "avatar": String,
    "state": {
        type: Number,
        default: 1
    },
    "likeArt": {
        type: Array,
        default: []
    },
    "role": {
        type: Number,
        default: 1
    }
})

// 三个参数分别为：模型名称，模式，集合名称
module.exports = mongoose.model('User', userSchema, 'users')
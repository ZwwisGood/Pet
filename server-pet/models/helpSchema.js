const mongoose = require('mongoose')
const helpSchemar = new mongoose.Schema({
    "helpId": Number,
    // 地点
    "place": String,
    // 详细地点
    "detailPlace": String,
    // 求助人电话
    "phone": String,
    // 求助人姓名
    "name": String,
    // 动物名称
    "petName": String,
    // 备注
    "remark": String,
    // 救助状态
    "status": {
        type: Number,
        default: 0 // 0:未处理 1:救助中 2: 救助失败 3:救助成功
    },
    // 失败理由
    "failReason": String,
    // 求救时间
    "createTime": {
        type: Date,
        default: Date.now
    },
    // 上次状态更新时间
    "updateTime": {
        type: Date,
        default: Date.now
    },
})
const mongoose = require('mongoose')
const adoptSchema = new mongoose.Schema({
    "petId": Number,
    // 申请者列表
    // 领养人
    "adopter": {
        type: Object,
        default: {}
    },
    "petName": String,
    "petType": String,
    "petAge": {
        type: String,
        default: '未知'
    },
    "petSex": String,
    "img": Array,
    // 发布时间
    "createTime": {
        type: Date,
        default: Date.now
    },
    // 更新时间
    "updateTime": {
        type: Date,
        default: Date.now
    },
    // 备注
    "remark": String,
    // 状态
    "status": {
        type: String,
        default: '待领养'
    },
})

module.exports = mongoose.model('Adopt', adoptSchema, 'adopt')
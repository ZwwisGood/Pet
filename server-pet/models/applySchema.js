const mongoose = require('mongoose')
const applySchema = new mongoose.Schema({
    "name": String,
    "userName": String,
    "phone": String,
    "idCard": String,
    "applyPetId": Number,
    "applyTime": {
        type: Date,
        default: Date.now
    },
    "status": {
        type: String,
        default: '领养中'  // 领养中、已领养、领养失败、已取消
    }
})

module.exports = mongoose.model('apply', applySchema, 'apply')
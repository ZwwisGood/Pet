const mongoose = require('mongoose')
const articleSchema = new mongoose.Schema({
    "title": String,
    "type": String,
    "content": String,
    // 发表时间
    "createTime": {
        type: Date,
        default: Date.now
    },
    // 点赞数
    "like": {
        type: Number,
        default: 0
    },
})

module.exports = mongoose.model('Article', articleSchema, 'articles')
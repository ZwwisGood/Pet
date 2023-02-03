// 维护用户ID自增长列表
const mongoose = require('mongoose')
const counterSchema = new mongoose.Schema({
    _id: { type: String },
    sequence_value: { type: Number }
})
module.exports = mongoose.model('Counter', counterSchema, "counters")
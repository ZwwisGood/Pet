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
    }
})

module.exports = mongoose.model('apply', applySchema, 'apply')
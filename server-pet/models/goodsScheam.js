const mongoose = require('mongoose')

const goodsScheam = new mongoose.Schema({
    "goodsId": Number,
    "goodsName": String,
    "goodsType": String,
    "goodsPrice": Number,
    "goodsImg": Array,
    // 商品描述
    "goodsDesc": String,
    // 商品状态
    "goodsStatus": {
        type: String,
        default: '上架' // 上架、下架
    },
    // 商品库存
    "goodsStock": Number,
    // 商品销量
    "goodsSales": {
        type: Number,
        default: 0
    },
    // 商品更新时间
    "updateTime": {
        type: Date,
        default: Date.now
    },
})
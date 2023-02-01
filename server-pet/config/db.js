const mongoose = require('mongoose')

// useNewUrlParser解决的警告是：当前URL字符串解析器已弃用，将在将来的版本中删除
// useUnifiedTopology解决的警告是：当前服务器发现和监视引擎已弃用，将在将来的版本中删除
mongoose.set('strictQuery', false) // 解除警告
mongoose.connect('mongodb://localhost:27017/server-pet', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, '*************************************数据库连接失败*************************************'))
db.once('open', function () {
    console.log('*************************************数据库连接成功*************************************')
})
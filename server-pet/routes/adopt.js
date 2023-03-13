const router = require('koa-router')()
const Adopt = require('../models/adoptSchema')
const Apply = require('../models/applySchema')
const util = require('../utils/utils')
const Counter = require('../models/counterSchema')
const multer = require('koa-multer')
const fs = require('fs')
const { log } = require('console')

router.prefix('/adopt')

router.get('/list', async (ctx) => {
    const { petName, status } = ctx.request.query
    const { page, skipIndex } = util.pager(ctx.request.query)
    let params = {}
    if (petName) params.petName = petName
    if (status) params.status = status
    try {
        const query = Adopt.find({
            ...params,
            petName: { $regex: petName || '', $options: 'i' },
        }).sort({ petId: -1 })
        const total = await Adopt.countDocuments(query);
        const list = await query.skip(skipIndex).limit(page.pageSize)
        ctx.body = util.success({
            page: {
                ...page,
                total
            },
            list
        })
    } catch (error) {
        ctx.body = util.fail(`查询异常:${error.stack}`)
    }
})

router.post('/add', async (ctx) => {
    const { petId, petName, petType, petAge, petSex, img, addImg, remark, action } = ctx.request.body
    if (action == 'edit') {
        // 查询是否已存在同名宠物
        // const r = await Adopt.find({ $or: [{ petName }] }, '_id petName')
        // if (r) {
        //     ctx.body = util.fail('该宠物名已存在')
        //     return
        // } else {
        const query = Adopt.find({
            petId
        })
        // 拿到img
        let arr
        const img = await query.select('img')
        let oldArr = img[0].img
        // 拿到addImg
        if (!addImg) {
            arr = oldArr
        } else {
            let newArr = addImg
            // 合并数组
            arr = oldArr.concat(newArr)
        }
        const result = await Adopt.updateOne({
            petId
        }, {
            petName,
            petType,
            petAge,
            petSex,
            img: arr,
            remark,
        })
        ctx.body = {
            code: 200,
            data: result
        }
    }
    // } else {
    else {
        // 查询是否已存在同名宠物
        const r = await Adopt.findOne({ $or: [{ petName }] }, '_id petName')
        if (r) {
            ctx.body = util.fail('该宠物名已存在')
            return
        }
        // 获取自增id
        const { sequence_value } = await Counter.findOneAndUpdate({
            _id: 'petId'
        }, {
            $inc: { sequence_value: 1 }
        }, {
            new: true,
        })
        const adopt = new Adopt({
            petId: sequence_value,
            petName,
            petType,
            petAge,
            petSex,
            img: addImg,
            remark,
            status: '待领养'
        })
        const result = await adopt.save()
        ctx.body = {
            code: 200,
            data: result
        }
    }
})

// 图片上传
var storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')  //注意路径必须存在
    },
    //修改文件名称
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})
//加载配置
var upload = multer({ storage: storage })

router.post('/upload', upload.array('file'), async (ctx) => {
    // 打印所有文件
    console.log('-==============-=-=-=-', ctx.req.files)
    // 返回一个图片数组
    let imgArr = []
    ctx.req.files.forEach(item => {
        imgArr.push("http://localhost:3000/uploads/" + item.filename)
    })
    ctx.body = util.success(imgArr)
})

// 删除图片
router.post('/delImg', async (ctx) => {
    let { petId, delImg } = ctx.request.body
    try {
        const query = Adopt.find({
            petId
        })
        // 拿到img
        let img = await query.select('img')
        let imgArr = img[0].img
        console.log('img', img[0].img);
        console.log('delImg', delImg);
        // 过滤掉img中的delImg
        let newArr = imgArr.filter(item => {
            return item != delImg
        })
        // let index = img.indexOf(delImg)
        // img = img.splice(index, 1)
        // 更新数据库
        const result = await Adopt.updateOne({
            petId
        }, {
            img: newArr
        })
        // unlinkSync删除
        fs.unlinkSync(`public/uploads/${delImg.slice(delImg.lastIndexOf('/') + 1)}`)
        ctx.body = util.success('删除成功')
    } catch (error) {
        ctx.body = util.fail(`删除失败:${error.stack}`)
    }
})

// 删除
router.post('/delete', async (ctx) => {
    const { petId } = ctx.request.body
    try {
        const res = await Adopt.deleteOne({ petId })
        ctx.body = util.success(res)
    } catch (error) {
        ctx.body = util.fail(`删除失败:${error.stack}`)
    }
})

// 申请人列表
router.post('/applyList', async (ctx) => {
    const { petId } = ctx.request.body
    try {
        const res = await Apply.aggregate([
            {
                $match: {
                    applyPetId: petId,
                    status: '领养中'
                },
            },
            {
                // 关联查询
                $lookup: {
                    from: 'users', // 关联的表名
                    localField: 'userName', // 当前表的字段
                    foreignField: 'userName', // 关联表的字段
                    as: 'user' // 新表名
                },
            },
            {
                // 需要显示的字段 上面的as为新表名
                $project: {
                    _id: 0,
                    name: 1,
                    phone: 1,
                    idCard: 1,
                    userName: 1,
                    applyPetId: 1,
                    applyTime: 1,
                    'user.userId': 1,
                }
            }
        ])
        // 拿到结果
        console.log('res', res);
        ctx.body = util.success(res)
        // const query = await Apply.find({
        //     petId
        // }).sort({ applyId: -1 })
        // // 返回列表
        // ctx.body = util.success(query)
    } catch (error) {
        ctx.body = util.fail(`查询异常:${error.stack}`)
    }
})

// 给TA领养
router.post('/addAdopter', async (ctx) => {
    const row = ctx.request.body
    try {
        // 更新宠物状态
        const res = await Adopt.updateOne({
            petId: row.applyPetId
        }, {
            status: '已领养',
            adopter: row
        })
        if (res.modifiedCount) {
            // 修改其他申请人状态
            const res1 = await Apply.updateMany({
                applyPetId: row.applyPetId,
                // 状态不为已取消
                status: {
                    $ne: '已取消'
                }
            },
                {
                    status: '领养失败'
                })
            // 更新申请人状态
            const res2 = await Apply.updateOne({
                idCard: row.idCard,
                applyPetId: row.applyPetId
            },
                {
                    status: '已领养'
                })
        }
        ctx.body = util.success(res)
    } catch (error) {
        ctx.body = util.fail(`操作失败:${error.stack}`)
    }
})

// 取消领养
router.post('/cancelAdopt', async (ctx) => {
    const { petId } = ctx.request.body
    try {
        const res = await Adopt.updateOne({
            petId
        }, {
            status: '待领养',
            adopter: {}
        })
        if (res.modifiedCount) {
            // 更新申请人状态
            const res1 = await Apply.updateMany({
                applyPetId: petId,
                // 状态不为已取消
                status: {
                    $ne: '已取消'
                }
            },
                {
                    status: '领养中'
                })
        }
        ctx.body = util.success(res)
    } catch (error) {
        ctx.body = util.fail(`取消领养失败:${error.stack}`)
    }
})

module.exports = router
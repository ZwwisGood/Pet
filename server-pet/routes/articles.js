const router = require('koa-router')()
const Article = require('../models/articleSchema')
const Counter = require('../models/counterSchema')
const util = require('../utils/utils')
const multer = require('koa-multer')
const fs = require('fs')
const { log } = require('console')

router.prefix('/article')

router.get('/list', async (ctx) => {
    const { artId, artTitle, artType, status } = ctx.request.query
    const { page, skipIndex } = util.pager(ctx.request.query)
    let params = {}
    if (artId) params.artId = artId
    if (artTitle) params.title = artTitle
    if (artType && artType != 0) params.type = artType
    if (status && status != 0) params.status = status
    try {
        console.log('params', params);
        const query = Article.find({
            ...params,
            title: { $regex: artTitle || '', $options: 'i' },
        })
        console.log('query', query);
        const list = await query.skip(skipIndex).limit(page.pageSize)
        const total = await Article.countDocuments(params)

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

router.post('/del', async (ctx) => {

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

router.post('/upload', upload.single('pic'), async (ctx) => {
    ctx.body = {
        // errno 即错误代码，0 表示没有错误。
        //       如果有错误，errno != 0，可通过下文中的监听函数 fail 拿到该错误码进行自定义处理
        "errno": 0,

        // data 是一个数组，返回图片Object，Object中包含需要包含url、alt和href三个属性,它们分别代表图片地址、图片文字说明和跳转链接,alt和href属性是可选的，可以不设置或设置为空字符串,需要注意的是url是一定要填的。
        "data": [
            {
                url: "http://localhost:3000/uploads/" + ctx.req.file.filename,
                alt: "",
                href: ""
            },
        ]
    }
})

router.post('/delImg', async (ctx) => {
    let { delImg } = ctx.request.body
    // unlinkSync删除
    fs.unlinkSync(`public/uploads/${delImg}`)
    ctx.body = {
        msg: '删除文件成功！'
    }
})

// 添加文章
router.post('/add', async (ctx) => {
    const { artId, title, content, type } = ctx.request.body
    if (artId) {
        // 编辑
        try {
            // 将artId为artId的文章覆盖
            await Article.findOneAndUpdate({ artId }, { title, content, type })
            ctx.body = util.success('修改成功')
        } catch (error) {
            ctx.body = util.fail(`查询异常:${error.stack}`)
        }
    }
    const createTime = util.formatDate(new Date())
    try {
        const doc = await Counter.findOneAndUpdate({ _id: 'artId' }, { $inc: { sequence_value: 1 } }, { new: true })
        const res = await Article.create({
            artId: doc.sequence_value,
            title,
            content,
            type,
            createTime
        })
        ctx.body = util.success(res)
    } catch (error) {
        ctx.body = util.fail(`查询异常:${error.stack}`)
    }
})

module.exports = router
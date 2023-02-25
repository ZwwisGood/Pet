const router = require('koa-router')()
const Help = require('../models/helpSchema')
const Counter = require('../models/counterSchema')
const util = require('../utils/utils')
const multer = require('koa-multer')
const fs = require('fs')

router.prefix('/help')

router.get('/list', async (ctx) => {
    const { name, status, createTime1, createTime2 } = ctx.request.query
    console.log('-----', createTime1, createTime2);
    const { page, skipIndex } = util.pager(ctx.request.query)
    let params = {}
    if (name) params.name = name
    if (status && status != 0) params.status = status
    try {
        let query = null
        let total
        if (createTime1 && createTime2) {
            query = Help.find({
                ...params,
                createTime: {
                    // 大于等于
                    $gte: createTime1,
                    // 小于等于
                    $lt: createTime2
                },
                name: { $regex: name || '', $options: 'i' },
            }).sort({ helpId: -1 })
        } else {
            query = Help.find({
                ...params,
                name: { $regex: name || '', $options: 'i' },
            }).sort({ helpId: -1 })
        }
        // 从数据库最后一条开始取
        total = await Help.countDocuments(query)
        const list = await query.skip(skipIndex).limit(page.pageSize)
        // total是query查询出来的总条数


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

router.post('/update', async (ctx) => {
    const { helpId, status, failReason, updateTime } = ctx.request.body
    console.log('-----', helpId, status, failReason);
    try {
        const res = await Help.findOneAndUpdate({ helpId }, { status, failReason, updateTime })
        if (res) {
            ctx.body = util.success(res)
        }
    } catch (error) {
        ctx.body = util.fail(`查询异常:${error.stack}`)
    }
})

module.exports = router
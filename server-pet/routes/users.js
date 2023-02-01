const router = require('koa-router')()
const User = require('../models/userSchema')
const Counter = require('../models/counterSchema')
const util = require('../utils/utils')

router.prefix('/user')

router.get('/list', async (ctx) => {
  const { userId, userName, state } = ctx.request.query
  const { page, skipIndex } = util.pager(ctx.request.query)
  let params = {}
  if (userId) params.userId = userId
  if (userName) params.userName = userName
  if (state && state != 0) params.state = state
  try {
    // 根据条件查询所有用户列表
    // 后面的参数表示不返回_id和userPwd字段
    const query = User.find({
      ...params,
      // userName采用模糊查询
      userName: { $regex: userName || '', $options: 'i' }, // $options: 'i' 忽略大小写
    }, { _id: 0, userPwd: 0 })
    const list = await query.skip(skipIndex).limit(page.pageSize)
    const total = await User.countDocuments(params);

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
  const { userId } = ctx.request.body
  try {
    // 软删除
    const res = await User.updateOne({
      userId
    }, {
      state: 0
    })
    ctx.body = util.success(res)
  } catch (error) {
    ctx.body = util.fail(`删除异常:${error.stack}`)
  }
})

module.exports = router

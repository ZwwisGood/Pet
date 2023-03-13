const router = require('koa-router')()
const User = require('../models/userSchema')
const Counter = require('../models/counterSchema')
const util = require('../utils/utils')
const jwt = require('jsonwebtoken')

router.prefix('/user')

router.get('/list', async (ctx) => {
  const { userId, userName, state, role } = ctx.request.query
  const { page, skipIndex } = util.pager(ctx.request.query)
  let params = {}
  if (userId) params.userId = userId
  if (userName) params.userName = userName
  if (role) params.role = role
  if (state && state != 0) params.state = state
  try {
    // 根据条件查询所有用户列表
    // 后面的参数表示不返回_id和userPwd字段
    const query = User.find({
      ...params,
      // userName采用模糊查询
      userName: { $regex: userName || '', $options: 'i' }, // $options: 'i' 忽略大小写
    }, { _id: 0, userPwd: 0 }).sort({ userId: -1 })
    const total = await User.countDocuments(query);
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

router.post('/add', async (ctx) => {
  const { userId, userName, userPwd, role, action, phone } = ctx.request.body
  try {
    // 添加
    if (action == 'add') {
      // 查询该用户名的数量
      const num = await User.find({ userName: userName }, '_id userName').count()
      console.log(num);
      if (num >= 1) {
        ctx.body = util.fail(`用户名已存在`)
        return
      }
      // 查询最大的userId
      const { sequence_value } = await Counter.findOneAndUpdate({
        _id: 'userId'
      }, {
        $inc: { sequence_value: 1 }
      }, {
        new: true,
      })
      // 新增用户
      const res = await User.create({
        userId: sequence_value,
        userName,
        phone,
        userPwd,
        state: 1,
        avatar: '',
        role
      })
      ctx.body = util.success(res)
    }
    else {
      // 编辑
      // 查询该userName的数量

      const r = await User.find({ $or: [{ userName }] }, '_id userName')
      if (r) {
        ctx.body = util.fail(`用户名已存在`)
        return
      } else {
        const res = await User.findOneAndUpdate({ userId }, { userName, userPwd, role, phone })
        ctx.body = util.success(res)
      }
    }
  } catch (error) {
    ctx.body = util.fail(`异常:${error.stack}`)
  }

})

router.post('/register', async (ctx) => {
  const { userName, userPwd, state } = ctx.request.body
  try {
    // 查询是否已存在该用户
    const r = await User.find({ userName })
    if (r) {
      ctx.body = util.fail(`用户已存在`)
    } else {
      // 查询最大的userId
      const { sequence_value } = await Counter.findOneAndUpdate({
        _id: 'userId'
      }, {
        $inc: { sequence_value: 1 }
      }, {
        new: true,
      })
      // 新增用户
      const res = await User.create({
        userId: sequence_value,
        userName,
        userPwd,
        state: 1,
        avatar: '',
      })
      console.log('ok')
      ctx.body = util.success(res)
    }
  } catch (error) {
    ctx.body = util.fail(`新增异常:${error.stack}`)
  }
})

// 登录
router.post('/login', async (ctx) => {
  try {
    const { userName, userPwd } = ctx.request.body
    const res = await User.findOne({
      userName,
      userPwd
    }, { _id: 0, userPwd: 0 })
    if (res) {
      const data = res._doc
      const token = jwt.sign({
        userId: data.userId,
        userName: data.userName,
        role: data.role
      }, 'zww', { expiresIn: '1h' })
      data.token = token
      ctx.body = util.success(data)
    } else {
      ctx.body = util.fail(`账号或密码不正确`)
    }
  } catch (error) {
    ctx.body = util.fail(err.stack)
  }
})
module.exports = router

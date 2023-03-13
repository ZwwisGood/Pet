const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const router = require('koa-router')()
const users = require('./routes/users')
const help = require('./routes/help')
const articles = require('./routes/articles')
const adopt = require('./routes/adopt')
const koajwt = require('koa-jwt')
const log4js = require('./utils/log4js')
const util = require('./utils/utils')

// error handler
onerror(app)

// 配置数据库
require('./config/db')

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  log4js.info(`===========GET params:${JSON.stringify(ctx.request.query)}`)
  log4js.info(`===========POST params:${JSON.stringify(ctx.request.body)}`)
  await next().catch((err) => {
    if (err.status == '401') {
      console.log('11111111111111111111', err)
      ctx.status = 200;
      ctx.body = util.fail('Token认证失败', util.CODE.AUTH_ERROR)
    } else {
      throw err;
    }
  })
})

app.use(koajwt({ secret: 'zww' }).unless({
  // 这里是白名单，不需要token的接口
  path: [/^\/api\/user\/login/]
}))

router.prefix('/api')

// routes
router.use(users.routes(), users.allowedMethods())
router.use(articles.routes(), articles.allowedMethods())
router.use(help.routes(), help.allowedMethods())
router.use(adopt.routes(), adopt.allowedMethods())

app.use(router.routes(), router.allowedMethods())


// error-handling
app.on('error', (err, ctx) => {
  log4js.error(`${err.stack}`)
});

module.exports = app

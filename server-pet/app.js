const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const router = require('koa-router')()
const users = require('./routes/users')
const articles = require('./routes/articles')
const koajwt = require('koa-jwt')
const log4js = require('./utils/log4js')

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
      ctx.status = 201;
      ctx.body = {
        msg: 'Token失效，请重新登录'
      }
    } else {
      throw err;
    }
  })
})
app.use(koajwt({ secret: 'zww' }).unless({
  // 这里是白名单，不需要token的接口
  path: [/^\/api/]
}))

router.prefix('/api')

// routes
router.use(users.routes(), users.allowedMethods())
router.use(articles.routes(), articles.allowedMethods())

app.use(router.routes(), router.allowedMethods())


// error-handling
app.on('error', (err, ctx) => {
  log4js.error(`${err.stack}`)
});

module.exports = app

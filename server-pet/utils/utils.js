/**
 * 分页结构封装
 * @param {number} pageNum
 * @param {number} pageSize
 */

const log4js = require('../utils/log4js');
const CODE = {
    SUCCESS: 200,
    PARAM_ERROR: 10001, // 参数错误
    USER_ACCOUNT_ERROR: 20001, //账号或密码错误
    USER_LOGIN_ERROR: 30001, // 用户未登录
    BUSINESS_ERROR: 40001, //业务请求失败
    AUTH_ERROR: 50001, // 认证失败或TOKEN过期
}
module.exports = {
    CODE,
    pager({ pageNum = 1, pageSize = 10 }) {
        pageNum *= 1;
        pageSize *= 1;
        const skipIndex = (pageNum - 1) * pageSize;
        return {
            page: {
                pageNum,
                pageSize
            },
            skipIndex
        }
    },
    success(data = '', msg = '', code = CODE.SUCCESS) {
        log4js.debug(data);
        return {
            code, data, msg
        }
    },
    fail(msg = '', code = CODE.BUSINESS_ERROR, data = '') {
        log4js.debug(msg);
        return {
            code, data, msg
        }
    },
    formatDate(dat) {
        //获取年月日，时间
        var year = dat.getFullYear();
        var mon = (dat.getMonth() + 1) < 10 ? "0" + (dat.getMonth() + 1) : dat.getMonth() + 1;
        var data = dat.getDate() < 10 ? "0" + (dat.getDate()) : dat.getDate();
        var hour = dat.getHours() < 10 ? "0" + (dat.getHours()) : dat.getHours();
        var min = dat.getMinutes() < 10 ? "0" + (dat.getMinutes()) : dat.getMinutes();
        var seon = dat.getSeconds() < 10 ? "0" + (dat.getSeconds()) : dat.getSeconds();

        var newDate = year + "-" + mon + "-" + data + " " + hour + ":" + min + ":" + seon;
        return newDate;
    }
}
/* eslint-disable import/newline-after-import */
/* eslint-disable import/no-commonjs */
// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
const config = require('./config')
cloud.init({
  env: 'bookstore-27eae6'
})

// 云函数入口函数
exports.main = async event =>
  new Promise((resolve, reject) => {
    const rqOptions = {
      uri: 'https://api.weixin.qq.com/sns/jscode2session',
      qs: {
        appid: config.appid,
        secret: config.secret,
        js_code: event.code,
        grant_type: 'authorization_code'
      }
    }
    rp(rqOptions)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })

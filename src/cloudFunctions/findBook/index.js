/* eslint-disable import/no-commonjs */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event) => new Promise((resolve, reject) => {
  try {
    db.collection('books').where({
      bookId: event.bookId,
      openid: event.openid
    }).get()
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  } catch (e) {
    console.log(e)
  }
})

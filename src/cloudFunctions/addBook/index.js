/* eslint-disable import/no-commonjs */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event) => new Promise((resolve, reject) => {
  try {
    db.collection('books').add({
      data: {
        title: event.title,
        author: event.author,
        bookId: event.bookId,
        cover: event.cover,
        openid: event.openid
      }
    })
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

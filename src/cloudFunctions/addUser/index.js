/* eslint-disable no-unused-vars */
/* eslint-disable import/no-commonjs */
/* eslint-disable import/newline-after-import */
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'bookstore-27eae6'
})

const db = cloud.database()

exports.main = async event => {
  const user = await db
    .collection('users')
    .where({
      openid: event.openid
    })
    .get()
  if (!user.data.length) {
    try {
      return await db.collection('users').add({
        data: {
          nickName: event.nickName,
          city: event.city,
          country: event.country,
          gender: event.gender,
          province: event.province,
          openid: event.openid,
          avatarUrl: event.avatarUrl
        }
      })
    } catch (e) {
      console.log(e)
    }
  } else {
    return {
      code: -1,
      errMsg: 'user has been existed'
    }
  }
}

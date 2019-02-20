import Taro from '@tarojs/taro'

//  prod
const BASE_URL = 'https://blog.iwaterlc.com'

//  dev
// const BASE_URL = 'http://localhost:7001';
const request = ({
  url,
  data = {},
  method = 'GET',
  header = {
    'content-type': 'application/json'
  }
}) => {
  if (!url) throw Error('The request url is required')
  return new Promise((resolve, reject) => {
    Taro.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header
    })
      .then(res => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}
const getDateDiff = date => {
  let dateTimeStamp = new Date(date.slice(0, 10).replace(/-/gi, '/'))
  const minute = 1000 * 60
  const hour = minute * 60
  const day = hour * 24
  const month = day * 30
  const now = new Date().getTime()
  const diffValue = now - Date.parse(dateTimeStamp)
  if (diffValue < 0) {
    return
  }
  const monthC = diffValue / month
  const weekC = diffValue / (7 * day)
  const dayC = diffValue / day
  const hourC = diffValue / hour
  const minC = diffValue / minute
  let result = null
  if (monthC >= 1) {
    result = '' + parseInt(monthC) + '月前'
  } else if (weekC >= 1) {
    result = '' + parseInt(weekC) + '周前'
  } else if (dayC >= 1) {
    result = '' + parseInt(dayC) + '天前'
  } else if (hourC >= 1) {
    result = '' + parseInt(hourC) + '小时前'
  } else if (minC >= 1) {
    result = '' + parseInt(minC) + '分钟前'
  } else result = '刚刚'
  return result
}
/**
 * 为数字加上单位：万或亿
 *
 * 例如：
 *      1000.01 => 1000.01
 *      10000 => 1万
 *      99000 => 9.9万
 *      566000 => 56.6万
 *      5660000 => 566万
 *      44440000 => 4444万
 *      11111000 => 1111.1万
 *      444400000 => 4.44亿
 *      40000000,00000000,00000000 => 4000万亿亿
 *      4,00000000,00000000,00000000 => 4亿亿亿
 *
 * @param {number} number 输入数字.
 * @param {number} decimalDigit 小数点后最多位数，默认为2
 * @return {string} 加上单位后的数字
 */
const getDigit = integer => {
  let num = (integer + '').split('.')[0]
  return num.length - 1
}
const addWan = (integer, number, mutiple, decimalDigit) => {
  let digit = getDigit(integer)
  if (digit > 3) {
    let remainder = digit % 8
    if (remainder >= 5) {
      // ‘十万’、‘百万’、‘千万’显示为‘万’
      remainder = 4
    }
    return (
      Math.round(number / Math.pow(10, remainder + mutiple - decimalDigit)) /
        Math.pow(10, decimalDigit) +
      '万'
    )
  } else {
    return (
      Math.round(number / Math.pow(10, mutiple - decimalDigit)) /
      Math.pow(10, decimalDigit)
    )
  }
}
const addChineseUnit = (number, decimalDigit) => {
  decimalDigit = decimalDigit == null ? 2 : decimalDigit
  let integer = Math.floor(number)
  let digit = getDigit(integer)
  // ['个', '十', '百', '千', '万', '十万', '百万', '千万'];
  let unit = []
  if (digit > 3) {
    let multiple = Math.floor(digit / 8)
    if (multiple >= 1) {
      let tmp = Math.round(integer / Math.pow(10, 8 * multiple))
      unit.push(addWan(tmp, number, 8 * multiple, decimalDigit))
      for (let i = 0; i < multiple; i++) {
        unit.push('亿')
      }
      return unit.join('')
    } else {
      return addWan(integer, number, 0, decimalDigit)
    }
  } else {
    return number
  }
}
export { request, getDateDiff, addChineseUnit }

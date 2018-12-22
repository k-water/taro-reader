import Taro from '@tarojs/taro'

//  prod
// const BASE_URL = 'https://blog.iwaterlc.com'

//  dev
const BASE_URL = 'http://localhost:7001'
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

export default request

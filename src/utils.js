import Taro from '@tarojs/taro';

//  prod
// const BASE_URL = 'https://blog.iwaterlc.com'

//  dev
const BASE_URL = 'http://localhost:7001';
const request = ({
  url,
  data = {},
  method = 'GET',
  header = {
    'content-type': 'application/json'
  }
}) => {
  if (!url) throw Error('The request url is required');
  return new Promise((resolve, reject) => {
    Taro.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header
    })
      .then(res => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};
const getDateDiff = date => {
  let dateTimeStamp = new Date(date.slice(0, 10).replace(/-/gi, '/'))
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const now = new Date().getTime();
  const diffValue = now - Date.parse(dateTimeStamp);
  if (diffValue < 0) {
    return;
  }
  const monthC = diffValue / month;
  const weekC = diffValue / (7 * day);
  const dayC = diffValue / day;
  const hourC = diffValue / hour;
  const minC = diffValue / minute;
  let result = null;
  if (monthC >= 1) {
    result = '' + parseInt(monthC) + '月前';
  } else if (weekC >= 1) {
    result = '' + parseInt(weekC) + '周前';
  } else if (dayC >= 1) {
    result = '' + parseInt(dayC) + '天前';
  } else if (hourC >= 1) {
    result = '' + parseInt(hourC) + '小时前';
  } else if (minC >= 1) {
    result = '' + parseInt(minC) + '分钟前';
  } else result = '刚刚';
  return result;
};

export { request, getDateDiff };

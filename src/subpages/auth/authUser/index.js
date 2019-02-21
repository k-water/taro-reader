/* eslint-disable no-undef */
import Taro, { Component, getStorageSync } from '@tarojs/taro'
import { View, Button, Image, Text } from '@tarojs/components'
import './index.scss'
import bookAuth from '../../../static/image/book-auth.jpg'

wx.cloud.init({
  env: 'bookstore-27eae6'
})
export default class AuthLogin extends Component {
  config = {
    navigationBarTitleText: '授权登录'
  }

  constructor() {
    super(...arguments)
  }

  componentWillMount() {
    const self = this
    Taro.checkSession({
      success() {},
      fail() {
        self.checkLogin()
      }
    })
  }

  getUserInfo(e) {
    let dertificateData = null
    if (e.detail.rawData) {
      dertificateData = getStorageSync('userCertificate')
      Taro.setStorage({
        key: e.detail.userInfo.nickName,
        data: e.detail.rawData
      })
      const {
        nickName,
        gender,
        city,
        country,
        avatarUrl,
        province
      } = e.detail.userInfo
      wx.cloud
        .callFunction({
          name: 'addUser',
          data: {
            nickName,
            gender,
            city,
            country,
            avatarUrl,
            province,
            openid: JSON.parse(dertificateData).openid
          }
        })
        .then()
        .catch(err => {
          Taro.showToast({
            title: '网络错误'
          })
          throw err
        })
    }
    Taro.navigateBack({
      delta: 1
    })
  }

  checkLogin() {
    Taro.login({
      success(res) {
        if (res.code) {
          wx.cloud
            .callFunction({
              name: 'userLogin',
              data: {
                code: res.code
              }
            })
            .then(loginRes => {
              Taro.setStorage({
                key: 'userCertificate',
                data: loginRes.result
              })
            })
        } else {
          Taro.showToast({
            title: '登录失败'
          })
        }
      },
      fail(err) {
        throw err
      }
    })
  }

  render() {
    return (
      <View class='auth-container'>
        <View className='auth-cover'>
          <Image mode='aspectFill' src={bookAuth} />
        </View>
        <View className='auth-tips'>
          <Text>
            小样轻读需要获得您的头像昵称等基础信息，只会用于登录，不会用作其他用途，点击下方授权登录。
          </Text>
        </View>
        <View className='auth-aciton'>
          <Button
            openType='getUserInfo'
            plain
            type='primary'
            onGetUserInfo={this.getUserInfo}
          >
            授权给小样轻读
          </Button>
        </View>
      </View>
    )
  }
}

/* eslint-disable no-undef */
import Taro, { Component, getStorageSync } from '@tarojs/taro'
import { View, Button, Image, Text } from '@tarojs/components'
import { AtToast } from 'taro-ui'
import './index.scss'
import bookAuth from '../../../static/image/book-auth.jpg'

export default class AuthLogin extends Component {
  config = {
    navigationBarTitleText: '授权登录'
  }

  constructor() {
    super(...arguments)
    this.state = {
      showToast: false
    }
  }

  componentDidShow() {
    this.checkLogin()
  }

  getUserInfo(e) {
    let certificateData = null
    if (e.detail.rawData) {
      certificateData = getStorageSync('userCertificate')
      Taro.setStorage({
        key: 'userInfo',
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
            openid: JSON.parse(certificateData).openid
          }
        })
        .then()
        .catch(err => {
          this.setState({
            showToast: true
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
    const { showToast } = this.state
    return (
      <View>
        {!showToast && (
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
        )}
        <AtToast isOpened={showToast} text='网络错误' status='error' />
      </View>
    )
  }
}

import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image, Text } from '@tarojs/components'
import './index.scss'
import bookAuth from '../../../static/image/book-auth.jpg'

export default class AuthLogin extends Component {
  config = {
    navigationBarTitleText: '授权登录'
  }

  constructor() {
    super(...arguments)
  }

  getUserInfo(e) {
    if (e.detail.rawData) {
      Taro.setStorage({
        key: e.detail.userInfo.nickName,
        data: e.detail.rawData
      })
    }
    Taro.navigateBack({
      delta: 1
    })
  }
  render() {
    return (
      <View class='auth-container'>
        <View className='auth-cover'>
          <Image
            mode='aspectFill'
            src={bookAuth}
          />
        </View>
        <View className='auth-tips'>
          <Text>
            小样轻读需要获得您的头像昵称等基础信息，只会用于登录，不会用作其他用途，点击下方授权登录。
          </Text>
        </View>
        <View className='auth-aciton'>
          <Button openType='getUserInfo' plain type='primary' onGetUserInfo={this.getUserInfo}>
            授权给小样轻读
          </Button>
        </View>
      </View>
    )
  }
}

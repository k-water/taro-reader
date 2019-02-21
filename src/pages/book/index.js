/* eslint-disable no-undef */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import { WXBizDataCrypt } from '../../utils'
import './index.scss'

wx.cloud.init()
export default class Index extends Component {
  config = {
    navigationBarTitleText: '书架'
  }

  constructor() {
    super(...arguments)
  }

  componentDidMount() {}

  componentDidShow() {
    this.checkAuth()
  }

  checkAuth() {
    Taro.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          Taro.navigateTo({
            url: '/subpages/auth/authUser/index'
          })
        }
      }
    })
  }

  render() {
    return (
      <View className='book-store'>
      </View>
    )
  }
}

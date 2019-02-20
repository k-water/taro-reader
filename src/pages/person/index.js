import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
// import { request } from '../../utils'
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '个人中心',
    backgroundColor: '#e4e8eb'
  }

  constructor() {
    super(...arguments)
    this.setState({
      userInfo: {}
    })
  }

  componentDidShow() {
    this.checkAuth()
  }
  componentDidMount() {
    this.getUserInfo()
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

  getUserInfo() {
    const self = this
    Taro.getUserInfo({
      success(res) {
        self.setState({
          userInfo: res.userInfo
        })
      }
    })
  }

  render() {
    const { userInfo } = this.state
    return (
      <View className='personal-container'>
        <View className='personal-info'>
          <View className='personal-name'>
            <Text>{userInfo.nickName}</Text>
          </View>
          <View className='personal-avatar'>
            <Image
              mode='aspectFill'
              src={userInfo.avatarUrl}
            />
          </View>
        </View>
      </View>
    )
  }
}

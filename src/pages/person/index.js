import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
// import { request } from '../../utils'
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '个人中心'
  }

  constructor() {
    super(...arguments)
  }

  componentDidMount() {
  }
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
      <View>
        <Button>test</Button>
      </View>
    )
  }
}

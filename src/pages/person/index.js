import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import bookIcon from '../../static/icon/book-search.png'
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '个人中心',
    backgroundColor: '#e4e8eb'
  }

  constructor() {
    super(...arguments)
    this.setState({
      userInfo: {},
      isLoading: true
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
    Taro.showLoading({
      title: '加载中...'
    })
    const self = this
    Taro.getStorage({
      key: 'userInfo'
    })
      .then(res => {
        self.setState(
          {
            userInfo: JSON.parse(res.data),
            isLoading: false
          },
          () => Taro.hideLoading()
        )
      })
      .catch(err => {
        throw err
      })
  }

  jumpToBookStore() {
    Taro.switchTab({
      url: '/pages/book/index'
    })
  }

  render() {
    const { userInfo, isLoading } = this.state
    if (!isLoading) {
      return (
        <View className='personal-container'>
          <View className='personal-info'>
            <View className='personal-name'>
              <Text>{userInfo.nickName}</Text>
            </View>
            <View className='personal-avatar'>
              <Image mode='aspectFill' src={userInfo.avatarUrl} />
            </View>
          </View>
          <View className='person-item'>
            <AtList>
              <AtListItem
                title='我的书单'
                arrow='right'
                thumb={bookIcon}
                onClick={this.jumpToBookStore}
              />
            </AtList>
          </View>
        </View>
      )
    }
  }
}

import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '书架'
  }

  constructor() {
    super(...arguments)
    this.state = {
      storeBooks: [],
      isLoading: true
    }
  }

  componentDidShow() {
    this.checkAuth()
  }

  componentDidHide() {
    this.setState({
      storeBooks: [],
      isLoading: true
    })
  }

  checkAuth() {
    const self = this
    Taro.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          Taro.navigateTo({
            url: '/subpages/auth/authUser/index'
          })
        } else {
          self.getStoreBooks()
        }
      }
    })
  }

  getStoreBooks() {
    Taro.showLoading({
      title: '加载中...'
    })
    const self = this
    const userCertificate = Taro.getStorageSync('userCertificate')
    // eslint-disable-next-line no-undef
    wx.cloud
      .callFunction({
        name: 'getBooks',
        data: {
          openid: JSON.parse(userCertificate).openid
        }
      })
      .then(res => {
        self.setState({
          storeBooks: res.result.data,
          isLoading: false
        })
        Taro.hideLoading()
      })
      .catch(err => {
        throw err
      })
  }

  jumpReadBookPage(bookId, bookTitle) {
    Taro.navigateTo({
      url: `/subpages/book/read/index?bookId=${bookId}&bookTitle=${bookTitle}`
    })
  }

  render() {
    const { storeBooks, isLoading } = this.state
    const baseImageUrl = 'http://statics.zhuishushenqi.com'
    if (!isLoading) {
      return (
        <View className='book-store'>
          <View className='book-header'>
            <View className='book-edit'>
              <Text>编辑</Text>
            </View>
          </View>
          <View className='book-content'>
            {storeBooks.map(item => {
              return (
                <View className='book-info' key={item._id} onClick={this.jumpReadBookPage.bind(this, item.bookId, item.title)}>
                  <Image
                    mode='aspectFill'
                    src={`${baseImageUrl}${item.cover}`}
                  />
                  <View className='book-title'>
                    {item.title}
                  </View>
                  <View className='book-author'>
                    {item.author}
                  </View>
                </View>
              )
            })}
          </View>
        </View>
      )
    }
  }
}

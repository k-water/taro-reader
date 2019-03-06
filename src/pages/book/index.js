import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Image,
  Text,
  CheckboxGroup,
  Checkbox,
  Label
} from '@tarojs/components'
import errorIcon from '../../static/icon/error.png'
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '书架'
  }

  constructor() {
    super(...arguments)
    this.state = {
      storeBooks: [],
      isLoading: true,
      isEdit: false,
      isSelected: []
    }
  }

  componentDidShow() {
    this.checkAuth()
  }

  componentDidHide() {
    this.setState({
      isLoading: false
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
    const { isLoading } = this.state
    if (isLoading) {
      Taro.showLoading({
        title: '加载中...'
      })
    }
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

  removeBook() {
    const { isSelected, isEdit } = this.state
    const self = this
    const userCertificate = Taro.getStorageSync('userCertificate')
    if (isSelected.length) {
      Taro.showLoading({
        title: '移除中...'
      })
      isSelected.map(item => {
        // eslint-disable-next-line no-undef
        wx.cloud
          .callFunction({
            name: 'delBook',
            data: {
              bookId: item,
              openid: JSON.parse(userCertificate).openid
            }
          })
          .then(() => {
            self.getStoreBooks()
            self.setState({
              isEdit: !isEdit
            })
            Taro.hideLoading()
            Taro.showToast({
              title: '已移除'
            })
          })
          .catch(err => {
            throw err
          })
      })
    } else {
      Taro.showToast({
        title: '请先选择书籍',
        image: errorIcon
      })
    }
  }

  editOrJump(bookId, bookTitle) {
    const { isEdit } = this.state
    if (!isEdit) {
      this.jumpReadBookPage(bookId, bookTitle)
    }
  }

  toggleBookEdit() {
    this.setState({
      isEdit: !this.state.isEdit
    })
  }

  handleCheckBoxChange(e) {
    this.setState({
      isSelected: e.detail.value
    })
  }

  render() {
    const { storeBooks, isLoading, isEdit } = this.state
    const baseImageUrl = 'http://statics.zhuishushenqi.com'
    if (!isLoading) {
      return (
        <View className='book-store'>
          <View className='book-header'>
            <View className='book-edit' onClick={this.toggleBookEdit}>
              <Text>{isEdit ? '取消' : '编辑'}</Text>
            </View>
          </View>
          <View>
            <CheckboxGroup
              onChange={this.handleCheckBoxChange}
              className='book-content'
            >
              {storeBooks.map(item => {
                return (
                  <View
                    key={item._id}
                    className='book-info'
                    onClick={this.editOrJump.bind(
                      this,
                      item.bookId,
                      item.title
                    )}
                  >
                    <Image
                      mode='aspectFill'
                      src={`${baseImageUrl}${item.cover}`}
                    />
                    <View className='book-title'>{item.title}</View>
                    <View className='book-author'>{item.author}</View>
                    {isEdit && (
                      <Label className='book-label'>
                        <Checkbox
                          className='book-checkbox'
                          value={item.bookId}
                        />
                      </Label>
                    )}
                  </View>
                )
              })}
            </CheckboxGroup>
          </View>
          {isEdit && (
            <View className='book-action'>
              <View className='book-cancel' onClick={this.toggleBookEdit}>
                <Text>取消</Text>
              </View>
              <View className='book-del' onClick={this.removeBook}>
                <Text>删除</Text>
              </View>
            </View>
          )}
        </View>
      )
    }
  }
}

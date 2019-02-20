import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtDivider } from 'taro-ui'
import TarBar from '../../../components/tarbar/'
import { request } from '../../../utils'
import './index.scss'

export default class Detail extends Component {
  config = {
    navigationBarTitleText: '全部'
  }

  constructor() {
    super(...arguments)

    this.state = {
      currentClassify: [],
      currentIndex: 0,
      bookList: [],
      isLoading: true
    }
  }

  componentDidMount() {
    this.getLv2Type()
    const { tag, type } = this.$router.params
    let classify = null
    type === 'press' ? (classify = 'over') : (classify = 'hot')
    this.getDetailBooks({
      type: classify,
      major: tag
    })
  }

  getLv2Type = () => {
    let { tag, type } = this.$router.params
    let tempClassify = []
    request({
      url: '/rapi/cats/lv2'
    })
      .then(res => {
        tempClassify = res[type].filter(item => item.major === tag)[0]
        tempClassify.mins.unshift('全部')
        this.setState({
          currentClassify: tempClassify
        })
      })
      .catch(err => {
        throw err
      })
  }

  getActiveItem = (val, minor) => {
    this.setState({
      currentIndex: val
    })
    const { tag, type } = this.$router.params
    minor === '全部' ? (minor = '') : (minor = minor)
    let classify = null
    type === 'press' ? (classify = 'over') : (classify = 'hot')
    const data = {
      type: classify,
      major: tag,
      minor,
      start: 0,
      limit: 20
    }
    this.getDetailBooks(data)
  }

  getDetailBooks = ({
    type = 'hot',
    major,
    minor = '',
    start = 0,
    limit = 20
  }) => {
    if (minor === '') {
      Taro.showLoading({
        title: '加载中'
      })
    }
    request({
      url: '/rapi/book/by-categorie',
      data: {
        type,
        major,
        minor,
        start,
        limit
      }
    })
      .then(res => {
        this.setState({
          bookList: res.books,
          isLoading: false
        })
        Taro.hideLoading()
      })
      .catch(err => {
        throw err
      })
  }

  jumpBookDetailPage(bookId) {
    Taro.navigateTo({
      url: `/subpages/details/bookDetail/index?bookId=${bookId}`
    })
  }

  render() {
    const {
      currentClassify: { mins },
      currentIndex,
      bookList,
      isLoading
    } = this.state
    const ImageBaseUrl = 'http://statics.zhuishushenqi.com'
    return (
      <View className='detail-wrap'>
        <View className='detail-header'>
          <View className='detail-type'>
            {mins &&
              mins.map((item, index) => (
                <TarBar
                  column={3}
                  key={item}
                  name={item}
                  onActived={this.getActiveItem.bind(this, index, item)}
                  activedStyle={index === currentIndex ? 'color: #6190E8;' : ''}
                />
              ))}
          </View>
        </View>
        <View className='detail-container'>
          {!isLoading && bookList.length > 0 ? (
            bookList.map(item => (
              <View
                className='detail-book'
                key={item._id}
                onClick={this.jumpBookDetailPage.bind(this, item._id)}
              >
                <View className='detail-cover'>
                  <Image
                    mode='aspectFill'
                    src={`${ImageBaseUrl}${item.cover}`}
                  />
                </View>
                <View className='detail-info'>
                  <Text className='detail-title'>{item.title}</Text>
                  <Text className='detail-author'>{item.author}</Text>
                  <Text className='detail-desc'>{item.shortIntro}</Text>
                </View>
              </View>
            ))
          ) : (
            <AtDivider
              customStyle={{ width: '90%', margin: '0 auto' }}
              content='暂无数据'
              fontColor='#979a9c'
              lineColor='#979a9c'
            />
          )}
        </View>
      </View>
    )
  }
}

import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Text,
  Image
} from '@tarojs/components'
import {
  AtSearchBar,
  Swiper,
  SwiperItem
} from 'taro-ui'
import request from '../../utils'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  constructor () {
    super(...arguments)

    this.state = {
      searchVal: '',
      swpierData: [],
      bookList: [],
      recommendBooks: []
    }

    this.onChange = this.onChange.bind(this)
  }

  componentWillMount () { }

  componentDidMount () {
    this.getRecommendInfo()
    this.getBookList()
    this.getRecommendList()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onChange (value) {
    this.setState({
      searchVal: value
    })
  }

  getRecommendInfo () {
    request({
      url: '/rapi/mweb/home'
    })
    .then(res => {
      this.setState({
        swpierData: res.data
      });
    })
    .catch(err => {
      throw(err);
    })
  }

  getBookList () {
    request({
      url: '/rapi/book-list'
    })
    .then(res => {
      this.setState({
        bookList: res.bookLists.slice(0, 3)
      });
    })
    .catch(err => {
      throw(err)
    })
  }

  getRecommendList () {
    request({
      url: '/rapi/recommendPage/node/books/all/57832d5ebe9f970e3dc4270d'
    })
    .then(res => {
      this.setState({
        recommendBooks: res.data
      });
    })
    .catch(err => {
      throw(err)
    })
  }

  render () {
    const { swpierData: { spread }, bookList, recommendBooks } = this.state
    const ImageBaseUrl = 'http://statics.zhuishushenqi.com'
    return (
      <View className='index-wrap'>
        <AtSearchBar
          value={this.state.searchVal}
          fixed
          placeholder='搜索书籍'
          onChange={this.onChange}
        />
        <View className='book-recommend'>
          <Swiper
            className='swiper-container'
            indicatorColor='#999'
            indicatorActiveColor='#333'
            circular
            indicatorDots
            autoplay
          >
            {
              spread && spread.map((item) => (
                <SwiperItem key={item._id}>
                  <View className='swiper-pic'>
                    <Image
                      style={{width: '100%', height: '220PX'}}
                      mode='scaleToFill'
                      src={item.img}
                    />
                  </View>
                </SwiperItem>
              ))
            }
          </Swiper>
        </View>

        <View className='layout-list'>
          <View className='layout-header'>
            <Text className='header-text'>热门书单</Text>
          </View>
          {
            bookList && bookList.map(item => (
              <View className='layout-container' key={item._id}>
                <View className='layout-image'>
                  <Image
                    style={{width: '100PX', height: '160PX'}}
                    mode='scaleToFill'
                    src={`${ImageBaseUrl}${item.cover}`}
                  />
                </View>
                <View className='layout-text'>
                  <View className='layout-title'>
                    {item.title}
                  </View>
                  <View className='layout-desc'>
                    {item.desc}
                  </View>
                </View>
              </View>
            ))
          }
        </View>

        <View className='layout-list'>
          <View className='layout-header'>
            <Text className='header-text'>精选书籍</Text>
          </View>
          {
            recommendBooks && recommendBooks.map(item => (
              <View className='layout-container' key={item._id}>
                <View className='layout-image'>
                  <Image
                    style={{width: '100PX', height: '160PX'}}
                    mode='scaleToFill'
                    src={`${item.book.cover}`}
                  />
                </View>
                <View className='layout-text'>
                  <View className='layout-title'>
                    {item.book.title}
                  </View>
                  <View className='layout-desc'>
                    {item.book.shortIntro}
                  </View>
                </View>
              </View>
            ))
          }
        </View>
      </View>
    )
  }
}


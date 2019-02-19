import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtList, AtListItem } from 'taro-ui'
import { request, addChineseUnit } from '../../../utils'
import './index.scss';

export default class BookInfoDetail extends Component {
  config = {
    navigationBarTitleText: ''
  }

  constructor() {
    super(...arguments)
    this.state = {
      bookInfo: {},
      bookChapters: [],
      bookAllChapters: [],
      isLoading: true,
      scrollCount: 2,
      windowHeight: 0
    }
  }

  componentDidMount() {
    const res = Taro.getSystemInfoSync()
    this.setState({
      windowHeight: res.windowHeight
    })
    this.getInitData()
  }

  getInitData = async () => {
    const { bookId } = this.$router.params
    // const bookId = '5acf0f68e098180e008227b2'
    const getBookInfo = request({
      url: `/rapi/book/${bookId}`
    })
    const getDirectoryId = await request({
      url: '/rapi/btoc',
      data: {
        book: bookId
      }
    })
    const getDirectory = request({
      url: `/rapi/btoc/${getDirectoryId[0]._id}`
    })
    Taro.showLoading({
      title: '加载中...'
    })
    Promise.all([getBookInfo, getDirectory])
      .then(resList => {
        this.setState({
          bookInfo: resList[0],
          bookChapters: resList[1].chapters.slice(0, 20),
          bookAllChapters: resList[1].chapters,
          isLoading: false
        }, () => Taro.setNavigationBarTitle({
          title: this.state.bookInfo.title
        }));
        Taro.hideLoading()
      })
  }

  // bad
  onPageScroll(e) {
    const { scrollCount, windowHeight, bookAllChapters } = this.state
    if (e.scrollTop > (windowHeight * (scrollCount - 1)) / 2) {
      this.setState({
        scrollCount: scrollCount + 1
      }, () => {
        if (scrollCount * 10 < bookAllChapters.length) {
          this.setState({
            bookChapters: bookAllChapters.slice(0, 10 * scrollCount)
          })
        } else {
          this.setState({
            bookChapters: bookAllChapters
          })
        }
      })
    }
  }

  render() {
    const { bookInfo, bookChapters, isLoading } = this.state
    if (!isLoading) {
      return (
        <View className='book-info-container'>
          <View className='info-desc'>
            <Text>简介</Text>
            <View className='desc-content'>
              {bookInfo.longIntro}
            </View>
          </View>
          <View className='info-copyright'>
            <Text>版权</Text>
            <View className='detail-copyright'>
              <View className='copyright-line'>
                <Text className='line-title'>版权</Text>
                <Text className='line-value' style={{color: 'rgb(24, 144, 255)'}}>{bookInfo.copyright}</Text>
              </View>
              <View className='copyright-line'>
                <Text className='line-title'>更新时间</Text>
                <Text className='line-value'>{bookInfo.updated && bookInfo.updated.substr(0, 10)}</Text>
              </View>
              <View className='copyright-line'>
                <Text className='line-title'>字数</Text>
                <Text className='line-value'>{addChineseUnit(bookInfo.wordCount)}</Text>
              </View>
              <View className='copyright-line'>
                <Text className='line-title'>分类</Text>
                <Text className='line-value'>{bookInfo.tags && bookInfo.tags.join(' ')}</Text>
              </View>
            </View>
          </View>
          <View className='info-directory'>
            <Text>目录</Text>
            <AtList hasBorder={false}>
              {
                bookChapters && bookChapters.map(item => {
                  return (
                    <AtListItem
                      key={item.id}
                      title={item.title}
                      hasBorder={false}
                    />
                  )
                })
              }
            </AtList>
          </View>
        </View>
      )
    }
  }
}

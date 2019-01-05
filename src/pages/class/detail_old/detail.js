import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Image,
  Text
} from '@tarojs/components'
import request from '../../../utils'
import './detail.scss'

export default class Detail extends Component {
  config = {

  }

  constructor () {
    super(...arguments)
    this.state = {
      maleLv2: [],
      bookList: []
    }
  }

  componentDidMount () {
    this.getStatisticsLv2()
  }

  getStatisticsLv2 () {
    let currentTags = null
    let { tag, type } = this.$router.params
    request({
      url: '/rapi/cats/lv2'
    })
    .then(res => {
      currentTags = res[type].filter(item => item.major === tag)
      console.log(currentTags)
      this.setState({
        maleLv2: currentTags
      }, () => {
        this.getLv2Book(this.state.maleLv2)
      })
    })
    .catch(err => {
      throw(err)
    })
  }

  getLv2Book (obj) {
    let promiseQueue = []
    let { tag } = this.$router.params
    obj[0].mins.map(item => {
      promiseQueue.push(new Promise((resolve, reject) => {
        request({
          url: '/rapi/book/by-categorie',
          data: {
            major: tag,
            minor: item
          }
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
      }))
    })
    Promise.all(promiseQueue).then(results => {
      this.setState({
        bookList: results
      })
    })
  }

  render () {
    const { maleLv2, bookList } = this.state
    const ImageBaseUrl = 'http://statics.zhuishushenqi.com'
    return (
      <View className='detail-lv2'>
        {
          maleLv2 && maleLv2[0].mins.map((item, index) => (
            <View className='detail-wrap' key={item}>
              <View className='detail-header'>
                <View className='detail-title'>{item}</View>
                <View className='detail-more'>查看更多</View>
              </View>
              <View className='detail-list'>
                {
                  bookList[index].books.map(book => (
                    <View className='detail-container' key={book._id}>
                      <Image
                        className='book-cover'
                        mode='aspectFill'
                        src={`${ImageBaseUrl}${book.cover}`}
                      />
                      <Text className='book-title'>{book.title}</Text>
                      <Text className='book-author'>{book.author}</Text>
                    </View>
                  ))
                }
              </View>
            </View>
          ))
        }
      </View>
    )
  }
}

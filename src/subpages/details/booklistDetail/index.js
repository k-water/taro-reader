import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import { request, getDateDiff } from '../../../utils'
import ListSimple from '../../../components/listSimple/'
import './index.scss'

export default class BookListDetail extends Component {
  config = {
    navigationBarTitleText: '书单详情'
  }

  constructor() {
    super(...arguments)

    this.state = {
      bookDetailList: {},
      isLoading: true
    }
  }

  componentDidMount() {
    this.getBookListData()
  }

  getBookListData = () => {
    Taro.showLoading({
      title: '加载中'
    })
    const { bookListId } = this.$router.params
    request({
      url: `/rapi/book-list/${bookListId}`
    })
      .then(res => {
        this.setState({
          bookDetailList: res.bookList,
          isLoading: false
        })
        Taro.hideLoading()
      })
      .catch(err => {
        throw err
      })
  }

  goToBookDetail(bookId) {
    Taro.navigateTo({
      url: `/subpages/details/bookDetail/index?bookId=${bookId}`
    })
  }

  render() {
    const { author, updated, title, desc, books } = this.state.bookDetailList
    const { isLoading } = this.state
    const ImageBaseUrl = 'http://statics.zhuishushenqi.com'
    if (!isLoading) {
      return (
        <View className='list-detail-container'>
          {author && (
            <View className='list-author'>
              <View className='author-avatar'>
                <AtAvatar image={`${ImageBaseUrl}${author.avatar}`} circle />
              </View>
              <View className='author-info'>
                <View className='author-name'> {author.nickname} </View>
                <View className='updated-time'> {getDateDiff(updated)} </View>
              </View>
            </View>
          )}

          <View className='list-info'>
            <View className='list-title'> {title} </View>
            <View className='list-desc'> {desc} </View>
          </View>

          <View className='book-content'>
            {books &&
              books.map(item => {
                const { book } = item
                return (
                  <View className='book-detail' key={book._id}>
                    <ListSimple
                      book={book}
                      onBookDetail={this.goToBookDetail.bind(this, book._id)}
                    />
                    <View className='book-comment'>{item.comment}</View>
                  </View>
                )
              })}
          </View>
        </View>
      )
    }
  }
}

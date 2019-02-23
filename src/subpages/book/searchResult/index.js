import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtDivider } from 'taro-ui'
import { request } from '../../../utils'
import List from '../../../components/list/list'
import './index.scss'

export default class BookSearchResult extends Component {
  config = {
    navigationBarTitleText: ''
  }

  constructor() {
    super(...arguments)
    this.state = {
      books: [],
      isLoading: true,
      pageStart: 1
    }
  }

  componentDidShow() {
    const { word } = this.$router.params
    // const word = 'xx'
    Taro.setNavigationBarTitle({
      title: `跟"${word}"有关的书籍`
    })
  }

  componentDidMount() {
    this.getInitData()
  }

  getInitData() {
    Taro.showLoading({
      title: '加载中...'
    })
    const { word } = this.$router.params
    // const word = 'xx'
    const getSearchResult = request({
      url: '/rapi/book/fuzzy-search',
      data: {
        query: word,
        start: 0,
        limit: 10
      }
    })
    Promise.all([getSearchResult])
      .then(resList => {
        this.setState({
          books: resList[0].books,
          isLoading: false
        })
        Taro.hideLoading()
      })
      .catch(err => {
        throw err
      })
  }

  getSearchResult(start) {
    const { word } = this.$router.params
    const { books } = this.state
    request({
      url: '/rapi/book/fuzzy-search',
      data: {
        query: word,
        start,
        limit: 10
      }
    })
      .then(res => {
        this.setState({
          books: books.concat(res.books)
        })
      })
      .catch(err => {
        throw(err)
      })
  }

  jumpToBookDetailPage(bookId) {
    Taro.navigateTo({
      url: `/subpages/details/bookDetail/index?bookId=${bookId}`
    })
  }

  onReachBottom() {
    let { pageStart } = this.state
    this.getSearchResult(pageStart * 10)
    this.setState({
      pageStart: pageStart + 1
    })
  }

  render() {
    const { books, isLoading } = this.state
    if (!isLoading) {
      return (
        <View className='search-container'>
          <View className='search-content'>
            {books.length ? (
              books.map(item => {
                return (
                  <List
                    key={item._id}
                    data={item}
                    onShowDetail={this.jumpToBookDetailPage.bind(
                      this,
                      item._id
                    )}
                  />
                )
              })
            ) : (
              <AtDivider
                content='没有更多书籍'
                fontColor='#2d8cf0'
                lineColor='#2d8cf0'
                customStyle={{
                  width: '95%',
                  margin: '0 auto'
                }}
              />
            )}
          </View>
        </View>
      )
    }
  }
}

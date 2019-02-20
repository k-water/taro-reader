import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import TarBar from '../../../components/tarbar/'
import { request } from '../../../utils'
import List from '../../../components/list/list'
import './index.scss'

export default class FeaturedList extends Component {
  config = {
    navigationBarTitleText: '精选小说'
  }

  constructor() {
    super(...arguments)
    this.state = {
      currentIndex: 0,
      isLoading: true,
      bookList: []
    }
  }
  componentDidMount() {
    let { dataTag } = this.$router.params
    this.getFeaturedBooks(JSON.parse(dataTag)[0].id)
  }

  getActived(index, id) {
    this.setState({
      currentIndex: index,
      isLoading: true
    })

    this.getFeaturedBooks(id)
  }

  getFeaturedBooks = id => {
    Taro.showLoading({
      title: '加载中'
    })
    request({
      url: `/rapi/recommendPage/node/books/all/${id}`,
      data: {
        size: 300
      }
    })
      .then(res => {
        this.setState({
          bookList: res.data,
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
    let { dataTag } = this.$router.params
    const { currentIndex, isLoading, bookList } = this.state

    return (
      <View className='featured-container'>
        <View className='featured-tarbar'>
          {dataTag &&
            JSON.parse(dataTag).map((item, index) => (
              <TarBar
                column={3}
                key={item.id}
                name={item.title}
                onActived={this.getActived.bind(this, index, item.id)}
                activedStyle={index === currentIndex ? 'color: #6190E8;' : ''}
              />
            ))}
        </View>
        <View className='featured-list'>
          {!isLoading &&
            bookList.map(item => {
              const { book } = item
              return (
                <List
                  key={item._id}
                  data={book}
                  onShowDetail={this.jumpBookDetailPage.bind(this, book._id)}
                />
              )
            })}
        </View>
      </View>
    )
  }
}

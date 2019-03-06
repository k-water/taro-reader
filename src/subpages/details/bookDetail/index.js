/* eslint-disable no-undef */
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtRate, AtIcon, AtAvatar } from 'taro-ui'
import { request, getDateDiff } from '../../../utils'
import './index.scss'

export default class BookDetail extends Component {
  config = {
    navigationBarTitleText: ''
  }

  constructor() {
    super(...arguments)
    this.state = {
      bookInfo: {},
      bookReview: [],
      bookRecommend: [],
      isLoading: true,
      bookStatus: false,
      isLoadReviewFinish: false
    }
  }

  componentDidMount() {
    this.getInitData()
  }
  componentDidShow() {
    this.checkBookStatus()
  }

  getInitData = () => {
    const { bookId } = this.$router.params
    // const bookId = '5acf0f68e098180e008227b2'
    const getBookInfo = request({
      url: `/rapi/book/${bookId}`
    })
    const getBookReview = request({
      url: '/rapi/post/review/by-book',
      data: {
        sort: 'helpful',
        book: bookId
      }
    })
    const getRecommendBook = request({
      url: `/rapi/book/${bookId}/recommend`
    })
    Taro.showLoading({
      title: '加载中...'
    })
    Promise.all([getBookInfo, getBookReview, getRecommendBook]).then(
      resList => {
        this.setState({
          bookInfo: resList[0],
          bookReview: resList[1].reviews,
          bookRecommend: resList[2].books,
          isLoading: false
        })
        Taro.hideLoading()
      }
    )
  }

  showMoreReview = async () => {
    const { bookId } = this.$router.params
    // const bookId = '5acf0f68e098180e008227b2'
    const res = await request({
      url: '/rapi/post/review/by-book',
      data: {
        start: this.state.bookReview.length,
        sort: 'helpful',
        book: bookId
      }
    })
    if (!res.reviews.length) {
      this.setState({
        isLoadReviewFinish: true
      })
      return
    }
    const temp = this.state.bookReview.concat(res.reviews)
    this.setState({
      bookReview: temp
    })
  }

  jumpMoreInfoPage = () => {
    Taro.navigateTo({
      url: `/subpages/details/bookInfo/index?bookId=${
        this.$router.params.bookId
      }`
    })
  }

  jumpReadPage = () => {
    Taro.navigateTo({
      url: `/subpages/book/read/index?bookId=${
        this.$router.params.bookId
      }&bookTitle=${this.state.bookInfo.title}`
    })
  }

  jumpToDetailPage(bookId) {
    Taro.navigateTo({
      url: `/subpages/details/bookDetail/index?bookId=${bookId}`
    })
  }

  checkBookStatus() {
    const { bookId } = this.$router.params
    // const bookId = '5acf0f68e098180e008227b2'
    const self = this
    const userCertificate = Taro.getStorageSync('userCertificate')
    wx.cloud
      .callFunction({
        name: 'findBook',
        data: {
          bookId,
          openid: JSON.parse(userCertificate).openid
        }
      })
      .then(res => {
        if (res.result.data.length) {
          self.setState({
            bookStatus: true
          })
        }
      })
      .catch(err => {
        throw err
      })
  }

  handleBookToStore = () => {
    // check
    const userInfo = Taro.getStorageSync('userInfo')
    if (!userInfo) {
      Taro.navigateTo({
        url: '/subpages/auth/authUser/index'
      })
    } else {
      const { bookStatus, bookInfo } = this.state
      const userCertificate = Taro.getStorageSync('userCertificate')
      const self = this
      if (!bookStatus) {
        Taro.showLoading({
          title: '加载中...'
        })
        wx.cloud
          .callFunction({
            name: 'addBook',
            data: {
              title: bookInfo.title,
              author: bookInfo.author,
              cover: bookInfo.cover,
              bookId: bookInfo._id,
              openid: JSON.parse(userCertificate).openid
            }
          })
          .then(() => {
            Taro.hideLoading()
            Taro.showToast({
              title: '已加入',
              icon: 'success'
            })
            self.setState({
              bookStatus: true
            })
          })
          .catch(err => {
            throw err
          })
      } else {
        Taro.showLoading({
          title: '加载中...'
        })
        wx.cloud
          .callFunction({
            name: 'delBook',
            data: {
              bookId: bookInfo._id,
              openid: JSON.parse(userCertificate).openid
            }
          })
          .then(() => {
            Taro.hideLoading()
            Taro.showToast({
              title: '已移出',
              icon: 'success'
            })
            self.setState({
              bookStatus: false
            })
          })
          .catch(err => {
            throw err
          })
      }
    }
  }

  jumpToReviewPage(reviewId) {
    Taro.navigateTo({
      url: `/subpages/details/bookReview/index?reviewId=${reviewId}`
    })
  }

  render() {
    const ImageUrl = 'http://statics.zhuishushenqi.com'
    const {
      bookInfo,
      bookReview,
      bookRecommend,
      isLoading,
      bookStatus,
      isLoadReviewFinish
    } = this.state
    if (!isLoading) {
      return (
        <View className='book-container'>
          {/* 基本信息 */}
          <View className='book-detail'>
            <View className='book-cover'>
              <Image mode='aspectFill' src={`${ImageUrl}${bookInfo.cover}`} />
            </View>
            <View className='book-info'>
              <Text className='book-title'>{bookInfo.title}</Text>
              <View className='book-author'>
                <AtIcon
                  value='check-circle'
                  color='rgb(23, 134, 251)'
                  size='15'
                  customStyle={{ marginRight: '2PX' }}
                />
                {bookInfo.author}
              </View>
              <View className='book-desc'>{bookInfo.longIntro}</View>
              <View className='book-more' onClick={this.jumpMoreInfoPage}>
                更多
              </View>
            </View>
          </View>
          {/* 评分信息 */}
          <View className='book-rank'>
            <View className='book-score'>
              <View className='book-star'>
                <Text>{Math.ceil(bookInfo.rating.score * 10) / 10}</Text>
                <AtRate
                  size='17'
                  value={Math.ceil(bookInfo.rating.score * 10) / 10 / 2}
                  customStyle={{ margin: '0 0 3PX 8PX' }}
                />
              </View>
              <View className='rank-text'>{bookInfo.rating.count}人点评</View>
            </View>
            <View className='book-follower'>
              <Text>{bookInfo.latelyFollower}</Text>
              <Text className='rank-text'>追书人气</Text>
            </View>
          </View>
          {/* 书籍点评 */}
          <View className='book-review'>
            <View className='review-header'>精彩点评</View>
            <View className='review-container'>
              {bookReview &&
                bookReview.map(item => {
                  const { author } = item
                  return (
                    <View
                      key={item._id}
                      style={{ marginBottom: '10PX' }}
                      onClick={this.jumpToReviewPage.bind(this, item._id)}
                    >
                      <View className='review-info'>
                        <View className='info-left'>
                          <View className='info-avatar'>
                            <AtAvatar
                              circle
                              image={`${ImageUrl}${author.avatar}`}
                              customStyle={{
                                width: '36PX',
                                height: '36PX'
                              }}
                            />
                          </View>
                          <View className='info-author'>
                            <Text className='author-name'>
                              {author.nickname}
                            </Text>
                            <Text className='author-time'>
                              {getDateDiff(item.updated)}
                            </Text>
                          </View>
                        </View>
                        <View className='info-right'>
                          <View className='info-rating'>
                            <AtRate size='15' value={item.rating} />
                          </View>
                          <View className='info-like'>
                            {item.likeCount}人觉得有用
                          </View>
                        </View>
                      </View>
                      <View className='review-text'>
                        <View className='review-title'>{item.title}</View>
                        <View
                          className='review-content'
                          style={
                            item.content.length > 110 ? 'text-align: left' : ''
                          }
                        >
                          {item.content}
                        </View>
                      </View>
                      <View className='review-extend'>
                        <View className='review-like'>
                          <AtIcon
                            value='heart'
                            size='18'
                            color='rgb(151, 155, 158)'
                          />
                          <Text>{item.likeCount}</Text>
                        </View>
                        <View className='review-comment'>
                          <AtIcon
                            value='message'
                            size='18'
                            color='rgb(151, 155, 158)'
                          />
                          <Text>{item.commentCount}</Text>
                        </View>
                      </View>
                    </View>
                  )
                })}
              {bookReview.length >= 3 && !isLoadReviewFinish && (
                <View className='review-more' onClick={this.showMoreReview}>
                  展开更多点评
                </View>
              )}
            </View>
          </View>
          {/* 书籍推荐 */}
          <View className='book-recommend'>
            <View className='recommend-header'>书籍推荐</View>
            <View className='recommend-content'>
              {bookRecommend &&
                bookRecommend.slice(0, 6).map(item => {
                  return (
                    <View
                      key={item._id}
                      className='recommend-info'
                      onClick={this.jumpToDetailPage.bind(this, item._id)}
                    >
                      <Image
                        mode='aspectFill'
                        src={`${ImageUrl}${item.cover}`}
                      />
                      <Text className='recommend-title'>{item.title}</Text>
                      <Text className='recommend-author'>{item.author}</Text>
                    </View>
                  )
                })}
            </View>
          </View>
          {/* 书籍操作 */}
          <View className='book-action'>
            <View className='book-add' onClick={this.handleBookToStore}>
              {bookStatus ? '移出书架' : '加入书架'}
            </View>
            <View className='book-read' onClick={this.jumpReadPage}>
              开始阅读
            </View>
          </View>
          {/* 样式hack */}
          <View>#</View>
        </View>
      )
    }
  }
}

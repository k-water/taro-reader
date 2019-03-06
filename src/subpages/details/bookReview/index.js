import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtAvatar, AtRate } from 'taro-ui'
import { request } from '../../../utils'
import './index.scss'

export default class BookReview extends Component {
  config = {
    navigationBarTitleText: ''
  }

  constructor() {
    super(...arguments)
    this.state = {
      isLoading: true,
      reviewInfo: {},
      reviewComment: [],
      pageStart: 1,
      loadReviewFinished: false
    }
  }

  componentDidMount() {
    this.getInitData()
  }

  getInitData() {
    Taro.showLoading({
      title: '加载中...'
    })
    const { reviewId } = this.$router.params
    // const reviewId = '5af6d13a12a4aa747c58c159'
    const getReviewDetail = request({
      url: `/rapi/post/review/${reviewId}`
    })

    const getReviewComment = request({
      url: `/rapi/post/review/${reviewId}/comment`
    })

    Promise.all([getReviewDetail, getReviewComment])
      .then(resList => {
        this.setState(
          {
            reviewInfo: resList[0].review,
            reviewComment: resList[1].comments,
            isLoading: false
          },
          () => Taro.hideLoading()
        )
      })
      .catch(err => {
        throw err
      })
  }

  getMoreComment() {
    const { reviewId } = this.$router.params
    // const reviewId = '5af6d13a12a4aa747c58c159'
    const { pageStart, reviewComment } = this.state
    if (pageStart * 10 >= reviewComment.commentCount) {
      this.setState({
        loadReviewFinished: true
      })
      return
    }
    request({
      url: `/rapi/post/review/${reviewId}/comment`,
      data: {
        start: pageStart * 10
      }
    })
      .then(res => {
        this.setState({
          reviewComment: reviewComment.concat(res.comments),
          pageStart: pageStart + 1
        })
      })
      .catch(err => {
        throw err
      })
  }

  jumpToBookDetailPage(bookId) {
    Taro.navigateTo({
      url: `/subpages/details/bookDetail/index?bookId=${bookId}`
    })
  }

  render() {
    const {
      isLoading,
      reviewInfo,
      reviewComment,
      loadReviewFinished
    } = this.state
    const baseImageUrl = 'http://statics.zhuishushenqi.com'
    if (!isLoading) {
      return (
        <View className='book-review'>
          <View className='review-author'>
            <View className='author-avatar'>
              <AtAvatar
                circle
                image={`${baseImageUrl}${reviewInfo.author.avatar}`}
              />
            </View>
            <View className='author-info'>
              <View className='author-name'>{reviewInfo.author.nickname}</View>
              <View className='author-rating'>
                点评此书
                <AtRate value={reviewInfo.rating} size={13} />
              </View>
            </View>
          </View>
          <View className='review-content'>
            <View className='content-title'>{reviewInfo.title}</View>
            <View className='content'>
              <Text>{reviewInfo.content}</Text>
            </View>
          </View>

          <View
            className='review-book'
            onClick={this.jumpToBookDetailPage.bind(this, reviewInfo.book._id)}
          >
            <View className='book-cover'>
              <Image
                mode='aspectFill'
                src={`${baseImageUrl}${reviewInfo.book.cover}`}
              />
            </View>
            <View className='book-info'>
              <View className='book-name'>{reviewInfo.book.title}</View>
              <View className='book-author'>{reviewInfo.book.author}</View>
            </View>
          </View>

          <View className='review-comment'>
            {reviewComment &&
              reviewComment.map(item => {
                return (
                  <View key={item._id} className='review-item'>
                    <View className='comment-avatar'>
                      <AtAvatar
                        circle
                        image={`${baseImageUrl}${item.author.avatar}`}
                      />
                    </View>
                    <View className='comment-content'>
                      <View className='comment-author'>
                        <View className='author-name'>
                          {item.author.nickname}
                        </View>
                        <View className='author-time'>
                          {item.created && item.created.substr(0, 10)}
                        </View>
                      </View>
                      <View className='content'>
                        {item.replyTo ? (
                          <View>
                            <Text style={{ color: 'rgb(176, 180, 181)' }}>
                              回复
                            </Text>{' '}
                            <Text style={{ color: 'rgb(131, 133, 132)' }}>
                              {item.replyTo.author.nickname}
                            </Text>{' '}
                            {item.content}
                          </View>
                        ) : (
                          item.content
                        )}
                      </View>
                    </View>
                  </View>
                )
              })}
          </View>
          {reviewInfo.commentCount > 10 && !loadReviewFinished && (
            <View className='load-more' onClick={this.getMoreComment}>
              展开更多评论
            </View>
          )}
        </View>
      )
    }
  }
}

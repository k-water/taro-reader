import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { AtRate, AtIcon, AtAvatar } from 'taro-ui';
import { request, getDateDiff } from '../../../utils'
import './index.scss';

export default class BookDetail extends Component {
  config = {
    navigationBarTitleText: ''
  };

  constructor() {
    super(...arguments);
    this.state = {
      bookInfo: {},
      bookReview: [],
      bookRecommend: []
    }
  }

  componentDidMount() {
    this.getBookInfo()
    this.getBookReview()
    this.getRecommendBook()
  }

  getBookInfo = () => {
    // const { bookId } = this.$router.params
    const bookId = '5acf0f68e098180e008227b2'
    request({
      url: `/rapi/book/${bookId}`
    })
      .then(res => {
        this.setState({
          bookInfo: res
        });
      })
      .catch(err => {
        throw(err)
      })
  }

  getBookReview = (start = 0, limit = 3) => {
    // const { bookId } = this.$router.params
    const bookId = '5acf0f68e098180e008227b2'
    request({
      url: '/rapi/post/review/by-book',
      data: {
        start,
        limit,
        book: bookId
      }
    })
      .then(res => {
        this.setState({
          bookReview: res.reviews
        });
      })
      .catch(err => {
        throw(err)
      })
  }

  getRecommendBook = (start = 0, limit = 6) => {
    // const { bookId } = this.$router.params
    const bookId = '5acf0f68e098180e008227b2'
    request({
      url: `/rapi/book/${bookId}/recommend`,
      data: {
        start,
        limit
      }
    })
      .then(res => {
        this.setState({
          bookRecommend: res.books
        });
      })
      .catch(err => {
        throw(err)
      })
  }

  render() {
    const ImageUrl = 'http://statics.zhuishushenqi.com'
    const { bookInfo, bookReview, bookRecommend } = this.state
    if (bookInfo && bookInfo.rating) {
      return (
        <View className='book-container'>
          <View className='book-detail'>
            <View className='book-cover'>
              <Image
                mode='aspectFill'
                src={`${ImageUrl}${bookInfo.cover}`}
              />
            </View>
            <View className='book-info'>
              <Text className='book-title'>
                {bookInfo.title}
              </Text>
              <View className='book-author'>
                <AtIcon
                  value='check-circle'
                  color='rgb(23, 134, 251)'
                  size='15'
                  customStyle={{marginRight: '2PX'}}
                >
                </AtIcon>
                {bookInfo.author}
              </View>
              <View className='book-desc'>
                {bookInfo.longIntro}
              </View>
              <View className='book-more'>
                更多
              </View>
            </View>
          </View>
          <View className='book-rank'>
            <View className='book-score'>
              <View className='book-star'>
                <Text>{Math.ceil(bookInfo.rating.score * 10) / 10}</Text>
                <AtRate
                  size='17'
                  value={Math.ceil(bookInfo.rating.score * 10) / 10 / 2}
                  customStyle={{margin: '0 0 3PX 8PX'}}
                />
              </View>
              <View className='rank-text'>
                {bookInfo.rating.count}人点评
              </View>
            </View>
            <View className='book-follower'>
              <Text>{bookInfo.latelyFollower}</Text>
              <Text className='rank-text'>追书人气</Text>
            </View>
          </View>
          <View className='book-review'>
            <View className='review-header'>
              精彩点评
            </View>
            <View className='review-container'>
              {
                bookReview.map(item => {
                  const { author } = item
                  return (
                    <View key={item._id} style={{marginBottom: '10PX'}}>
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
                            >
                            </AtAvatar>
                          </View>
                          <View className='info-author'>
                            <Text className='author-name'>{author.nickname}</Text>
                            <Text className='author-time'>
                              {getDateDiff(item.updated)}
                            </Text>
                          </View>
                        </View>
                        <View className='info-right'>
                          <View className='info-rating'>
                            <AtRate
                              size='15'
                              value={item.rating}
                            >
                            </AtRate>
                          </View>
                          <View className='info-like'>
                            {item.likeCount}人觉得有用
                          </View>
                        </View>
                      </View>
                      <View className='review-text'>
                        <View className='review-title'>
                          {item.title}
                        </View>
                        <View className='review-content'>
                          {item.content}
                        </View>
                      </View>
                    </View>
                  )
                })
              }
            </View>
          </View>
          <View className='book-recommend'>
            <View className='recommend-header'>
              书籍推荐
            </View>
            <View className='recommend-content'>
              {
                bookRecommend.slice(0, 6).map(item => {
                  return (
                    <View key={item._id} className='recommend-info'>
                      <Image
                        mode='aspectFill'
                        src={`${ImageUrl}${item.cover}`}
                      />
                      <Text className='reacommend-title'>
                        {item.title}
                      </Text>
                      <Text className='recommend-author'>
                        {item.author}
                      </Text>
                    </View>
                  )
                })
              }
            </View>
          </View>
          <View className='book-action'>
            <View className='book-add'>
              加入书架
            </View>
            <View className='book-read'>
              开始阅读
            </View>
          </View>
          <View>#</View>
        </View>
      )
    }
  }
}

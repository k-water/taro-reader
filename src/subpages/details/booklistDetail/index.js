import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { AtAvatar, AtTag } from 'taro-ui';
import { request, getDateDiff } from '../../../utils';
import './index.scss';

export default class BookListDetail extends Component {
  config = {
    navigationBarTitleText: '书单详情'
  };

  constructor() {
    super(...arguments);

    this.state = {
      bookDetailList: {}
    };
  }

  componentDidMount() {
    this.getBookListData();
  }

  getBookListData = () => {
    request({
      url: '/rapi/book-list/5c332bce830dee000162b2de'
    })
      .then(res => {
        this.setState({
          bookDetailList: res.bookList
        });
      })
      .catch(err => {
        throw err;
      });
  };

  render() {
    const { author, updated, title, desc, books } = this.state.bookDetailList;
    const ImageBaseUrl = 'http://statics.zhuishushenqi.com';
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
              const { book } = item;
              return (
                <View className='book-detail' key={book._id}>
                  <View className='book-intro'>
                    <View className='book-cover'>
                      <Image
                        mode='aspectFill'
                        src={`${ImageBaseUrl}${book.cover}`}
                      />
                    </View>
                    <View className='book-info'>
                      <View className='book-title'> {book.title} </View>
                      <View className='book-author'> {book.author} </View>
                      <View className='book-tag'>
                        <AtTag
                          circle
                          size='small'
                          customStyle={{ marginRight: '5PX' }}
                        >
                          {book.majorCate}
                        </AtTag>
                        <AtTag circle size='small'>
                          {book.minorCate}
                        </AtTag>
                      </View>
                      <View className='book-popular'>
                        <View>
                          <Text>{book.latelyFollower}</Text>人气
                        </View>
                        <View>
                          <Text>{book.retentionRatio.toFixed(2)}%</Text>读者留存
                        </View>
                      </View>
                    </View>
                  </View>
                  <View className='book-comment'>{item.comment}</View>
                </View>
              );
            })}
        </View>
      </View>
    );
  }
}

import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtTag } from 'taro-ui'
import PropTypes from 'prop-types'
import './index.scss'

export default class ListSimple extends Component {
  config = {}

  constructor() {
    super(...arguments)
  }

  static propTypes = {
    book: PropTypes.object.isRequired,
    customStyle: PropTypes.object,
    coverStyle: PropTypes.object
  }

  render() {
    const ImageBaseUrl = 'http://statics.zhuishushenqi.com'
    const { book, customStyle, coverStyle, onBookDetail } = this.props
    if (book) {
      return (
        <View className='book-intro' style={customStyle} onClick={onBookDetail}>
          <View className='book-cover'>
            <Image
              mode='aspectFill'
              src={`${ImageBaseUrl}${book.cover}`}
              style={coverStyle}
            />
          </View>
          <View className='book-info'>
            <View className='book-title'> {book.title} </View>
            <View className='book-author'> {book.author} </View>
            <View className='book-tag'>
              <AtTag circle size='small'>
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
                <Text>
                  {book.retentionRatio.length
                    ? book.retentionRatio
                    : book.retentionRatio.toFixed(2)}
                  %
                </Text>
                读者留存
              </View>
            </View>
          </View>
        </View>
      )
    }
  }
}

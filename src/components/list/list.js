import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import PropTypes from 'prop-types'
import './list.scss'

export default class List extends Component {
  constructor() {
    super(...arguments)
  }
  static defaultProps = {
    data: {
      cover: ''
    }
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    styleCover: PropTypes.object
  }

  render() {
    const ImageBaseUrl = 'http://statics.zhuishushenqi.com'
    const { data, styleCover } = this.props
    return (
      <View
        className='list-container'
        key={data._id}
        onClick={this.props.onShowDetail}
      >
        <View className='list-image'>
          <Image
            style={styleCover}
            mode='aspectFill'
            src={
              data.cover.startsWith(ImageBaseUrl)
                ? `${data.cover}`
                : `${ImageBaseUrl}${data.cover}`
            }
          />
        </View>
        <View className='list-text'>
          <View className='list-title'>{data.title}</View>
          <View className='list-desc'>
            {data.desc ? data.desc : data.shortIntro}
          </View>
        </View>
      </View>
    )
  }
}

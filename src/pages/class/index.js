import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Image
} from '@tarojs/components'
import request from '../../utils'
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '分类'
  }

  constructor () {
    super(...arguments)
    this.state = {
      statistics: []
    }
  }

  componentDidMount () {
    this.getBookStatictis()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  getBookStatictis () {
    request({
      url: '/rapi/cats/lv2/statistics'
    })
    .then(res => {
      this.setState({
        statistics: res.male
      });
    })
    .catch(err => {
      throw(err)
    })
  }

  render () {
    const ImageBaseUrl = 'http://statics.zhuishushenqi.com'
    const { statistics } = this.state
    return (
      <View className='book-statistic'>
        <View className='statistic-wrap'>
          {
            statistics && statistics.map(item => (
              <View className='statistic-detail' key={item.name}>
                <View className='statistic-name'>
                  {item.name}
                </View>
                <View className='statistic-img'>
                  <Image
                    mode='scaleToFill'
                    style={{width: '100PX', height: '120PX'}}
                    src={`${ImageBaseUrl}${item.bookCover[0]}`}
                  />
                </View>
              </View>
            ))
          }
        </View>
      </View>
    )
  }
}

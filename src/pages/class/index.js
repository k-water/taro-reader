import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Image
} from '@tarojs/components'
import {
  AtTabBar
} from 'taro-ui'
import request from '../../utils'
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '分类'
  }

  constructor () {
    super(...arguments)
    this.state = {
      current: 0,
      statistics: []
    }

    this.changeCurrent = this.changeCurrent.bind(this)
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
        statistics: res
      });
    })
    .catch(err => {
      throw(err)
    })
  }
  enterLv2 (tag, type) {
    Taro.navigateTo({
      url: `/pages/classDetails/detail/detail?tag=${tag}&type=${type}`
    })
  }
  changeCurrent (value) {
    this.setState({
      current: value
    })
  }
  render () {
    const ImageBaseUrl = 'http://statics.zhuishushenqi.com'
    const { statistics, current } = this.state
    const typeList = ['male', 'female', 'press']
    let list = statistics[typeList[current]]
    return (
      <View className='book-statistic'>
        <AtTabBar
          tabList={[
            {
              title: '男生',
            },
            {
              title: '女生'
            },
            {
              title: '出版物'
            }
          ]}
          color='rgb(151, 154, 156)'
          current={current}
          onClick={this.changeCurrent}
        />
        <View className='statistic-wrap'>
          {
            list && list.map(item => (
              <View className='statistic-detail'
                key={item.name}
                onClick={this.enterLv2.bind(this, item.name, typeList[current])}
              >
                <View className='statistic-name'>
                  {item.name}
                </View>
                <View className='statistic-img'>
                  <Image
                    mode='aspectFill'
                    style={{width: '60PX', height: '80PX'}}
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

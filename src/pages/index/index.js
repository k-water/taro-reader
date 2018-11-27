import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import request from '../../utils'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () {
    request({
      url: '/rapi'
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        throw(err);
      })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
      </View>
    )
  }
}


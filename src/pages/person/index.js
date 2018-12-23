import Taro, { Component } from '@tarojs/taro'
import {
  View
} from '@tarojs/components'
// import request from '../../utils'
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '个人中心'
  }

  constructor () {
    super(...arguments)
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View>个人中心</View>
    )
  }
}

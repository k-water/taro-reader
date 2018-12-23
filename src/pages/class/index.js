import Taro, { Component } from '@tarojs/taro'
import {
  View
} from '@tarojs/components'
// import request from '../../utils'
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '分类'
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
      <View>分类</View>
    )
  }
}

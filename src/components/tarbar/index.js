import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'
import './index.scss'

export default class TarBar extends Component {
  config = {}
  constructor() {
    super(...arguments)
  }
  static propTypes = {
    column: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    activedStyle: PropTypes.string.isRequired,
    onActived: PropTypes.func
  }
  render() {
    const { column, name, activedStyle, onActived } = this.props
    const columnWidth = 100 / column + '%'
    return (
      <View
        className='tarbar-text'
        onClick={onActived}
        style={{ width: columnWidth }}
      >
        <Text style={activedStyle}>{name}</Text>
      </View>
    )
  }
}

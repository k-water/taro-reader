import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './index.scss'

export default class TarBar extends Component {
  config = {};
  constructor() {
    super(...arguments);
  }

  render() {
    const { name, activedStyle, onActived } = this.props;
    return (
      <View className='tarbar-text' onClick={onActived}>
        <Text
          style={activedStyle}
        >
          {name}
        </Text>
      </View>
    );
  }
}

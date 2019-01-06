import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './list.scss';

export default class List extends Component {
  constructor() {
    super(...arguments);
  }

  render() {
    const ImageBaseUrl = 'http://statics.zhuishushenqi.com';
    const { data, styleCover } = this.props;
    return (
      <View className='list-container' key={data._id}>
        <View className='list-image'>
          <Image
            style={styleCover}
            mode='aspectFill'
            src={
              data.cover ? `${ImageBaseUrl}${data.cover}` : `${data.book.cover}`
            }
          />
        </View>
        <View className='list-text'>
          <View className='list-title'>
            {data.title ? data.title : data.book.title}
          </View>
          <View className='list-desc'>
            {data.desc ? data.desc : data.book.shortIntro}
          </View>
        </View>
      </View>
    );
  }
}

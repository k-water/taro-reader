import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtTag } from 'taro-ui';
import request from '../../../utils';
import './index.scss';

const tagLv1 = ['本周最热', '最新发布', '最多收藏'];
const tagLv2 = ['全部', '男生', '女生', '都市'];
export default class bookList extends Component {
  config = {
    navigationBarTitleText: '主题书单'
  };

  constructor() {
    super(...arguments);
    this.state = {
      currentLv1Tag: 0,
      currentLv2Tag: 0,
      currentDetailTagName: null,
      isShow: false,
      bookTags: []
    };
  }

  componentDidMount() {
    this.getBookTags();
  }

  getBookTags = () => {
    request({
      url: '/rapi/tags'
    })
      .then(res => {
        this.setState({
          bookTags: res.data
        });
      })
      .catch(err => {
        throw err;
      });
  };

  handleLv1Tag(index) {
    this.setState({
      currentLv1Tag: index
    });
  }

  handleLv2Tag(index) {
    this.setState({
      currentLv2Tag: index
    });
  }

  handleDetailTag(val) {
    this.setState({
      currentDetailTagName: val,
      isShow: !this.state.isShow
    });
    tagLv2.splice(1, 1, val);
    this.handleLv2Tag(1);
  }

  showFilter = () => {
    this.setState({
      isShow: !this.state.isShow
    });
  };
  render() {
    const {
      currentLv1Tag,
      currentLv2Tag,
      isShow,
      bookTags,
      currentDetailTagName
    } = this.state;
    return (
      <View className='book-list-wrap'>
        <View className='filter-lv1'>
          {tagLv1.map((item, index) => (
            <AtTag
              key={item}
              name={item}
              circle
              active={tagLv1[currentLv1Tag] === item}
              customStyle={{ fontSize: '13PX' }}
              onClick={this.handleLv1Tag.bind(this, index)}
            >
              {item}
            </AtTag>
          ))}
        </View>
        <View className='filter-lv2'>
          {tagLv2.map((item, index) => (
            <AtTag
              key={item}
              name={item}
              circle
              active={tagLv2[currentLv2Tag] === item}
              customStyle={{ fontSize: '13PX' }}
              onClick={this.handleLv2Tag.bind(this, index)}
            >
              {item}
            </AtTag>
          ))}
          <AtTag
            className='filter-detail'
            name='筛选'
            active
            onClick={this.showFilter}
          >
            筛选
          </AtTag>
        </View>
        <View className='book-list' />
        {isShow && (
          <View className='filter-all'>
            <View className='tag-list'>
              {bookTags.map(item => (
                <View className='tag-container' key={item.name}>
                  <View className='tag-title'>{item.name}</View>
                  <View className='tag-name'>
                    {item.tags.map(tag => (
                      <AtTag
                        key={tag}
                        name={tag}
                        circle
                        customStyle={{
                          fontSize: '13PX',
                          marginBottom: '10PX',
                          color: 'rgb(136, 135, 134)'
                        }}
                        active={currentDetailTagName === tag}
                        onClick={this.handleDetailTag.bind(this, tag)}
                      >
                        {tag}
                      </AtTag>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  }
}

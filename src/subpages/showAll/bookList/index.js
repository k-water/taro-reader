import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtTag } from 'taro-ui';
import List from '../../../components/list/list';
import { request } from '../../../utils';
import './index.scss';

const tagLv1 = ['本周最热', '最新发布', '最多收藏'];
const tagLv2 = ['全部', '言情', '历史', '都市'];

const lv1Params = {
  本周最热: {
    duration: 'last-seven-days',
    sort: 'collectorCount'
  },
  最新发布: {
    duration: 'all',
    sort: 'created'
  },
  最多收藏: {
    duration: 'all',
    sort: 'collectorCount'
  }
};

let data = {
  duration: 'last-seven-days',
  sort: 'collectorCount',
  tag: '',
  gender: '',
  start: 0,
  limit: 20
};
export default class BookListAll extends Component {
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
      bookTags: [],
      bookList: []
    };
  }

  componentDidMount() {
    this.getBookTags();
    this.getBookList(data);
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

  getBookList = params => {
    request({
      url: '/rapi/book-list',
      data: params
    })
      .then(res => {
        this.setState({
          bookList: res.bookLists
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
    data = Object.assign(data, lv1Params[tagLv1[index]]);

    this.getBookList(data);
  }

  handleLv2Tag(index) {
    this.setState({
      currentLv2Tag: index
    });
    let temp = null;
    if (tagLv2[index] === '全部') {
      temp = '';
      this.setState({
        currentDetailTagName: ''
      });
    } else {
      temp = tagLv2[index];
    }
    data = Object.assign(data, {
      tag: temp
    });

    this.getBookList(data);
  }

  handleDetailTag(val) {
    this.setState({
      currentDetailTagName: val,
      isShow: !this.state.isShow
    });
    tagLv2.splice(1, 1, val);
    this.handleLv2Tag(1);
    data = Object.assign(data, {
      tag: val
    });
    this.getBookList(data);
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
      currentDetailTagName,
      bookList
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
        <View className='book-list'>
          {!isShow &&
            bookList &&
            bookList.map(item => <List key={item._id} data={item} />)}
        </View>
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

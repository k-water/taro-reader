import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtSearchBar, Swiper, SwiperItem } from 'taro-ui';
import List from '../../components/list/list'
import request from '../../utils';
import './index.scss';

export default class Index extends Component {
  config = {
    navigationBarTitleText: '书城'
  };

  constructor() {
    super(...arguments);

    this.state = {
      searchVal: '',
      swpierData: [],
      bookList: [],
      recommendBooks: [],
      loading: true
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {}

  componentDidMount() {
    this.getData();
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onChange(value) {
    this.setState({
      searchVal: value
    });
  }

  getData() {
    const getRecommendInfo = request({
      url: '/rapi/mweb/home'
    });
    const getBookList = request({
      url: '/rapi/book-list'
    });
    const getRecommendList = request({
      url: '/rapi/recommendPage/node/books/all/57832d5ebe9f970e3dc4270d'
    });

    Taro.showLoading({
      title: '加载中'
    });

    Promise.all([getRecommendInfo, getBookList, getRecommendList])
      .then(resList => {
        this.setState({
          swpierData: resList[0].data,
          bookList: resList[1].bookLists.slice(0, 3),
          recommendBooks: resList[2].data,
          loading: false
        });
        Taro.hideLoading();
      })
      .catch(err => {
        throw err;
      });
  }

  showMore = () => {
    Taro.navigateTo({
      url: `/subpages/showAll/bookList/index`
    })
  }

  render() {
    const {
      swpierData: { spread },
      bookList,
      recommendBooks,
      loading
    } = this.state;
    if (!loading) {
      return (
        <View className='index-wrap'>
          <AtSearchBar
            value={this.state.searchVal}
            fixed
            placeholder='搜索书籍'
            onChange={this.onChange}
          />
          <View className='book-recommend'>
            <Swiper
              className='swiper-container'
              indicatorColor='#999'
              indicatorActiveColor='#333'
              circular
              indicatorDots
              autoplay
            >
              {spread &&
                spread.map(item => (
                  <SwiperItem key={item._id}>
                    <View className='swiper-pic'>
                      <Image
                        style={{ width: '100%', height: '220PX' }}
                        mode='scaleToFill'
                        src={item.img}
                      />
                    </View>
                  </SwiperItem>
                ))}
            </Swiper>
          </View>

          <View className='layout-list'>
            <View className='layout-header'>
              <Text className='header-text'>热门书单</Text>
              <Text className='view-more' onClick={this.showMore}>查看更多</Text>
            </View>
            {bookList &&
              bookList.map(item => (
                <List key={item.id} data={item} />
              ))}
          </View>

          <View className='layout-list'>
            <View className='layout-header'>
              <Text className='header-text'>精选书籍</Text>
            </View>
            {recommendBooks &&
              recommendBooks.map(item => (
                <List key={item.id} data={item} />
              ))}
          </View>
        </View>
      );
    }
  }
}

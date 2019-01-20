import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtSearchBar, Swiper, SwiperItem } from 'taro-ui';
import List from '../../components/list/list';
import ListSimple from '../../components/listSimple/';
import { request } from '../../utils';
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
  }

  componentDidMount() {
    this.getData();
  }

  onChange = value => {
    this.setState({
      searchVal: value
    });
  };

  getData() {
    const getRecommendInfo = request({
      url: '/rapi/mweb/home'
    });
    const getBookList = request({
      url: '/rapi/book-list'
    });
    const getRecommendList = request({
      url: '/rapi/recommendPage/node/books/all/57832d5ebe9f970e3dc4270d',
      data: {
        size: 4
      }
    });

    Taro.showLoading({
      title: '加载中'
    });

    Promise.all([getRecommendInfo, getBookList, getRecommendList])
      .then(resList => {
        this.setState({
          swpierData: resList[0].data,
          bookList: resList[1].bookLists.slice(0, 4),
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
    });
  };

  showBookList(bookListId) {
    Taro.navigateTo({
      url: `/subpages/details/booklistDetail/index?bookListId=${bookListId}`
    });
  }

  showFeatured(nodes) {
    let dataTag = [];
    nodes.map(item => {
      dataTag.push({
        id: item._id,
        title: item.title,
        sex: item.sex,
        bookType: item.bookType
      });
    });
    dataTag = JSON.stringify(dataTag);
    Taro.navigateTo({
      url: `/subpages/showAll/featuredList/index?dataTag=${dataTag}`
    });
  }

  render() {
    const {
      swpierData: { spread, nodes, ranking },
      bookList,
      recommendBooks,
      loading
    } = this.state;
    let rankingLimit = null
    if (ranking) {
      rankingLimit = ranking.slice(0, 4)
    }
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
              <Text className='view-more' onClick={this.showMore}>
                查看更多
              </Text>
            </View>
            {bookList &&
              bookList.map(item => (
                <List
                  key={item._id}
                  data={item}
                  onShowDetail={this.showBookList.bind(this, item._id)}
                />
              ))}
          </View>

          <View className='layout-list'>
            <View className='layout-header'>
              <Text className='header-text'>排行榜</Text>
              <Text className='view-more'>查看更多</Text>
            </View>
            {rankingLimit &&
              rankingLimit.map(item => (
                <ListSimple
                  book={item}
                  key={item._id}
                  coverStyle={{ margin: '0 0 10PX 15PX' }}
                />
              ))}
          </View>

          <View className='layout-list'>
            <View className='layout-header'>
              <Text className='header-text'>精选书籍</Text>
              <Text
                className='view-more'
                onClick={this.showFeatured.bind(this, nodes)}
              >
                查看更多
              </Text>
            </View>
            {recommendBooks &&
              recommendBooks.map(item => {
                const { book } = item;
                return <List key={item.id} data={book} />;
              })}
          </View>
        </View>
      );
    }
  }
}

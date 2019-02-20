import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtTabBar } from 'taro-ui';
import { request } from '../../../utils';
import './index.scss';

export default class Ranking extends Component {
  config = {
    navigationBarTitleText: '排行榜'
  };

  constructor() {
    super(...arguments);
    this.state = {
      isLoading: true,
      currentGengerIndex: 0,
      currentTitle: 0,
      currentGenger: 'male',
      rankingGender: [],
      rankingMaleBooks: []
    };
  }

  componentDidMount() {
    this.getAllRanking();
    this.getSingleRanking();
  }

  getAllRanking = () => {
    request({
      url: '/rapi/ranking/gender'
    })
      .then(res => {
        this.setState({
          rankingGender: res
        });
      })
      .catch(err => {
        throw err;
      });
  };

  getSingleRanking(rankingId = '54d42d92321052167dfb75e3', index = 0) {
    this.setState(
      {
        isLoading: true,
        currentTitle: index
      },
      () =>
        Taro.showLoading({
          title: '加载中'
        })
    );
    request({
      url: `/rapi/ranking/${rankingId}`
    })
      .then(res => {
        this.setState(
          {
            rankingMaleBooks: res.ranking,
            isLoading: false
          },
          () => Taro.hideLoading()
        );
      })
      .catch(err => {
        throw err;
      });
  }

  handleCurrentSex(val) {
    val === 0
      ? this.setState(
          {
            currentGengerIndex: val,
            currentGenger: 'male'
          },
          () => this.getSingleRanking()
        )
      : this.setState(
          {
            currentGengerIndex: val,
            currentGenger: 'female'
          },
          () => this.getSingleRanking('54d43437d47d13ff21cad58b')
        );
  }

  jumpBookDetailPage(bookId) {
    Taro.navigateTo({
      url: `/subpages/details/bookDetail/index?bookId=${bookId}`
    })
  }

  render() {
    const {
      isLoading,
      currentGengerIndex,
      currentGenger,
      currentTitle,
      rankingGender,
      rankingMaleBooks: { books }
    } = this.state;
    const ImageBaseUrl = 'http://statics.zhuishushenqi.com';
    return (
      <View className='ranking-detail'>
        <View className='ranking-tarbar'>
          <AtTabBar
            tabList={[{ title: '男生' }, { title: '女生' }]}
            current={currentGengerIndex}
            onClick={this.handleCurrentSex.bind(this)}
          />
        </View>
        <View className='ranking-container'>
          <View className='ranking-sidebar'>
            {rankingGender &&
              rankingGender[currentGenger].map((item, index) => (
                <View
                  className={
                    index === currentTitle
                      ? 'ranking-title ranking-actived'
                      : 'ranking-title'
                  }
                  key={item._id}
                  onClick={this.getSingleRanking.bind(this, item._id, index)}
                >
                  {item.shortTitle}
                </View>
              ))}
          </View>
          <View className='ranking-books'>
            {!isLoading &&
              books &&
              books.map(book => (
                <View className='book-intro' key={book._id} onClick={this.jumpBookDetailPage.bind(this, book._id)}>
                  <View className='book-cover'>
                    <Image
                      mode='aspectFill'
                      src={`${ImageBaseUrl}${book.cover}`}
                    />
                  </View>
                  <View className='book-info'>
                    <View className='book-title'> {book.title} </View>
                    <View className='book-desc'> {book.shortIntro} </View>
                    <View className='book-popular'>
                      <View>
                        <Text>{book.latelyFollower}</Text>人气
                      </View>
                      <View>
                        <Text>
                          {book.retentionRatio.length
                            ? book.retentionRatio
                            : book.retentionRatio.toFixed(2)}
                          %
                        </Text>
                        留存
                      </View>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        </View>
      </View>
    );
  }
}

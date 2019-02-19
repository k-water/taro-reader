import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { request } from '../../../utils'
import './index.scss';

export default class BookRead extends Component {
  config = {
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#f2eeeb',
    backgroundColor: '#f2eeeb'
  }

  constructor() {
    super(...arguments)
    this.state = {
      bookDirectory: [],
      chapterContent: [],
      isLoading: true,
      currentIndex: 0
    }
  }

  componentDidMount() {
    const { bookTitle } = this.$router.params
    this.getInitData()
    Taro.setNavigationBarTitle({
      title: bookTitle
    })
  }

  getInitData = async () => {
    Taro.showLoading({
      title: '加载中...'
    })
    // const { bookId } = this.$router.params
    const bookId = '5acf0f68e098180e008227b2'
    const getDirectoryId = await request({
      url: '/rapi/btoc',
      data: {
        book: bookId
      }
    })
    const getDirectory = await request({
      url: `/rapi/btoc/${getDirectoryId[0]._id}`
    })
    this.setState({
      bookDirectory: getDirectory.chapters
    })

    const getChapterContent = await request({
      url: '/rapi/bookChapter',
      data: {
        link: getDirectory.chapters[this.state.currentIndex].link
      }
    })
    this.setState({
      chapterContent: getChapterContent.chapter,
      isLoading: false
    })
    Taro.hideLoading()
  }

  getChapterContent(index) {
    this.setState({
      isLoading: true
    })
    Taro.showLoading({
      title: '加载中...'
    })
    const { bookDirectory } = this.state
    if (index < 0 || index > bookDirectory.length) {
      return
    }
    request({
      url: '/rapi/bookChapter',
      data: {
        link: bookDirectory[index].link
      }
    })
      .then(res => {
        this.setState({
          chapterContent: res.chapter,
          currentIndex: index,
          isLoading: false
        })
      })
      .catch(err => {
        throw(err)
      })
    Taro.hideLoading()
  }

  render() {
    const { chapterContent, isLoading, currentIndex } = this.state
    if (!isLoading) {
      return (
        <View class='read-container'>
          <View className='read-title'>
            {chapterContent.title}
          </View>
          <View className='read-content'>
            <Text>
              {chapterContent.cpContent}
            </Text>
          </View>
          <View className='read-action'>
            <View
              className='next-chapter'
              onClick={this.getChapterContent.bind(this, currentIndex + 1)}
            >
              <Text>下一章</Text>
            </View>
            <View className='action-last'>
              <View
                className={currentIndex === 0 ? 'prev-chapter disabled' : 'prev-chapter'}
                onClick={this.getChapterContent.bind(this, currentIndex - 1)}
              >
                <Text>上一章</Text>
              </View>
              <View className='read-director'>
                <Text>目录</Text>
              </View>
            </View>
          </View>
        </View>
      )
    }
  }
}

import Taro, { Component } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { AtDrawer, AtList, AtListItem } from 'taro-ui'
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
      bookAllDirectory: [],
      chapterContent: [],
      isLoading: true,
      currentIndex: 0,
      showDirectory: false,
      windowHeight: 0,
      scrollCount: 2
    }
  }

  componentDidMount() {
    const { bookTitle } = this.$router.params
    this.getInitData()
    Taro.setNavigationBarTitle({
      title: bookTitle
    })
    const systemInfo = Taro.getSystemInfoSync()
    this.setState({
      windowHeight: systemInfo.windowHeight
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
      bookDirectory: getDirectory.chapters.slice(0, 20),
      bookAllDirectory: getDirectory.chapters
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
    const { bookAllDirectory } = this.state
    if (index < 0 || index > bookAllDirectory.length) {
      return
    }
    request({
      url: '/rapi/bookChapter',
      data: {
        link: bookAllDirectory[index].link
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

  toggleDirectoryDrawer = () => {
    const { showDirectory, bookAllDirectory } = this.state
    if (showDirectory) {
      this.setState({
        bookDirectory: bookAllDirectory.slice(0, 20),
        scrollCount: 2
      })
    }
    this.setState({
      showDirectory: !showDirectory
    })
  }

  jumpToChapter(index) {
    this.setState({
      currentIndex: index,
      showDirectory: false
    }, () => this.getChapterContent(index))
  }

  onScroll(e) {
    const { windowHeight, scrollCount, bookAllDirectory } = this.state
    if (scrollCount === 2 && e.detail.scrollTop > (windowHeight / 8 * (scrollCount - 1))) {
        this.setState({
          scrollCount: scrollCount + 1
        }, () => {
        this.setState({
          bookDirectory: bookAllDirectory.slice(0, 20 * scrollCount)
        })
      })
    }
    if (e.detail.scrollTop > (windowHeight / 5 * (scrollCount - 1))) {
      this.setState({
        scrollCount: scrollCount + 1
      }, () => {
        if (scrollCount * 20 < bookAllDirectory.length) {
          this.setState({
            bookDirectory: bookAllDirectory.slice(0, 20 * scrollCount)
          })
        } else {
          this.setState({
            bookDirectory: bookAllDirectory
          })
        }
      })
    }
  }

  render() {
    const { chapterContent, isLoading, currentIndex, showDirectory, bookDirectory, windowHeight } = this.state
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
              <View
                className='read-director'
                onClick={this.toggleDirectoryDrawer}
              >
                <Text>目录</Text>
              </View>
            </View>
          </View>

          <AtDrawer
            show={showDirectory}
            right
            mask
            onClose={this.toggleDirectoryDrawer}
            width='80%'
          >
              <View className='drawer-title'>
                {this.$router.params.bookTitle}
              </View>
              <ScrollView
                className='drawer-item'
                scrollY
                scrollTop='0'
                style={`height: ${windowHeight}px`}
                onScroll={this.onScroll}
              >
                <AtList>
                  {
                    showDirectory && bookDirectory.map((item, index) => {
                      return (
                        <AtListItem
                          key={item._id}
                          title={item.title}
                          className={index === currentIndex ? 'drawer-actived' : ''}
                          onClick={this.jumpToChapter.bind(this, index)}
                        />
                      )
                    })
                  }
                </AtList>
              </ScrollView>
            </AtDrawer>
        </View>
      )
    }
  }
}

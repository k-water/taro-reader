import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtDrawer, AtList, AtListItem } from 'taro-ui'
import { request } from '../../../utils'
import './index.scss'

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
      scrollCount: 2,
      showBottomSheet: false,
      modeIndex: 0,
      fontIndex: 2
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
    const { bookId } = this.$router.params
    // const bookId = '5acf0f68e098180e008227b2'
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


    // 阅读记录
    let historyChapter = Taro.getStorageSync('historyChapter')
    let findBook = null
    if (historyChapter) {
      historyChapter = JSON.parse(historyChapter)
      findBook = historyChapter.filter(item => item.bookId === bookId)
      if (!findBook.length) {
        historyChapter.push({
          bookId,
          currentChapter: this.state.currentIndex
        })
        Taro.setStorage({
          key: 'historyChapter',
          data: JSON.stringify(historyChapter)
        })
      } else {
        this.setState({
          currentIndex: findBook[0].currentChapter
        })
      }
    } else {
      let currentBook = [
        {
          bookId,
          currentChapter: this.state.currentIndex
        }
      ]
      Taro.setStorage({
        key: 'historyChapter',
        data: JSON.stringify(currentBook)
      })
    }

    const getChapterContent = await request({
      url: '/rapi/bookChapter',
      data: {
        link:
          getDirectory.chapters[
            findBook && findBook.length
              ? findBook[0].currentChapter
              : this.state.currentIndex
          ].link
      }
    })
    this.setState({
      chapterContent: getChapterContent.chapter,
      isLoading: false
    })
    Taro.hideLoading()
  }

  getChapterContent(index) {
    const { bookAllDirectory } = this.state
    const { bookId } = this.$router.params
    if (index < 0 || index > bookAllDirectory.length) {
      return
    }
    this.setState({
      isLoading: true
    })
    Taro.showLoading({
      title: '加载中...'
    })
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
          showBottomSheet: false,
          isLoading: false
        })
      })
      .catch(err => {
        throw err
      })
    let cacheBook = Taro.getStorageSync('historyChapter')
    if (cacheBook.length) {
      cacheBook = JSON.parse(cacheBook)
      let findBookIndex = cacheBook.findIndex(item => item.bookId === bookId)
      if (~findBookIndex) {
        cacheBook[findBookIndex].currentChapter = index
      } else {
        cacheBook.push({
          bookId,
          currentChapter: index
        })
      }
      Taro.setStorage({
        key: 'historyChapter',
        data: JSON.stringify(cacheBook)
      })
        .then()
        .catch(err => {
          throw err
        })
    }
    Taro.hideLoading()
  }

  toggleDirectoryDrawer = () => {
    const { showDirectory, showBottomSheet, bookAllDirectory } = this.state
    if (showDirectory) {
      this.setState({
        bookDirectory: bookAllDirectory.slice(0, 20),
        scrollCount: 2
      })
    }

    if (showBottomSheet) {
      this.toggleBottomSheet()
    }

    this.setState({
      showDirectory: !showDirectory
    })
  }

  jumpToChapter(index) {
    this.setState(
      {
        currentIndex: index,
        showDirectory: false
      },
      () => this.getChapterContent(index)
    )
  }

  onScroll(e) {
    const { windowHeight, scrollCount, bookAllDirectory } = this.state
    if (
      scrollCount === 2 &&
      e.detail.scrollTop > (windowHeight / 8) * (scrollCount - 1)
    ) {
      this.setState(
        {
          scrollCount: scrollCount + 1
        },
        () => {
          this.setState({
            bookDirectory: bookAllDirectory.slice(0, 20 * scrollCount)
          })
        }
      )
    }
    if (e.detail.scrollTop > (windowHeight / 5) * (scrollCount - 1)) {
      this.setState(
        {
          scrollCount: scrollCount + 1
        },
        () => {
          if (scrollCount * 20 < bookAllDirectory.length) {
            this.setState({
              bookDirectory: bookAllDirectory.slice(0, 20 * scrollCount)
            })
          } else {
            this.setState({
              bookDirectory: bookAllDirectory
            })
          }
        }
      )
    }
  }

  toggleBottomSheet = () => {
    const { showBottomSheet } = this.state
    this.setState({
      showBottomSheet: !showBottomSheet
    })
  }

  changeMode(index, color) {
    this.setState({
      modeIndex: index
    })
    Taro.setNavigationBarColor({
      frontColor: index === 1 ? '#ffffff' : '#000000',
      backgroundColor: color
    })
    Taro.setBackgroundColor({
      backgroundColor: color
    })
  }

  changeFont(index) {
    if (index < 0 || index > 5) {
      return
    }
    this.setState({
      fontIndex: index
    })
  }

  render() {
    const {
      chapterContent,
      isLoading,
      currentIndex,
      showDirectory,
      bookDirectory,
      windowHeight,
      showBottomSheet,
      bookAllDirectory,
      modeIndex,
      fontIndex
    } = this.state
    if (!isLoading) {
      return (
        <View
          class='read-container'
          onLongPress={this.toggleBottomSheet}
          style={
            modeIndex === 0
              ? 'background-color: #f2eeeb'
              : modeIndex === 1
              ? 'background-color: #191919'
              : 'background-color: #c8edcc'
          }
        >
          <View style={{ padding: '20PX 10PX' }}>
            <View
              className='read-title'
              style={
                modeIndex === 1
                  ? `color: rgb(104, 104, 104); font-size: ${14 +
                      fontIndex * 2}PX`
                  : `font-size: ${14 + fontIndex * 2}PX`
              }
            >
              {chapterContent.title}
            </View>
            <View className='read-content'>
              <Text
                style={
                  modeIndex === 1
                    ? `color: rgb(100, 100, 100); font-size: ${12 +
                        fontIndex * 2}PX`
                    : `font-size: ${12 + fontIndex * 2}PX`
                }
              >
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
                  className={
                    currentIndex === 0
                      ? 'prev-chapter disabled'
                      : 'prev-chapter'
                  }
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
          </View>

          <View
            className='bottom-sheet'
            style={
              showBottomSheet ? 'display: block; height: 190PX;' : 'height: 0'
            }
          >
            <View className='read-font'>
              <View
                className='font-decrease'
                onClick={this.changeFont.bind(this, fontIndex - 1)}
              >
                <Text>Aa-</Text>
              </View>
              <View className='font-line'>
                <View
                  className='progress-line'
                  style={{ width: `${fontIndex * 20}%` }}
                />
              </View>
              <View
                className='font-increase'
                onClick={this.changeFont.bind(this, fontIndex + 1)}
              >
                <Text>Aa+</Text>
              </View>
            </View>
            <View className='read-mode'>
              <View
                className={
                  modeIndex === 0 ? 'mode-default mode-actived' : 'mode-default'
                }
                onClick={this.changeMode.bind(this, 0, '#f2eeeb')}
              >
                <Text>默认</Text>
              </View>
              <View
                className={
                  modeIndex === 1 ? 'mode-night mode-actived' : 'mode-night'
                }
                onClick={this.changeMode.bind(this, 1, '#191919')}
              >
                <Text>夜间</Text>
              </View>
              <View
                className={
                  modeIndex === 2 ? 'mode-eye mode-actived' : 'mode-eye'
                }
                onClick={this.changeMode.bind(this, 2, '#c8edcc')}
              >
                <Text>护眼</Text>
              </View>
            </View>
            <View className='read-operate'>
              <View
                className='prev-chapter'
                onClick={this.getChapterContent.bind(this, currentIndex - 1)}
              >
                <Text
                  style={currentIndex === 0 ? 'color: rgb(124, 124, 124)' : ''}
                >
                  上一章
                </Text>
              </View>
              <View
                className='book-director'
                onClick={this.toggleDirectoryDrawer}
              >
                <Text>目录</Text>
              </View>
              <View
                className='next-chapter'
                onClick={this.getChapterContent.bind(this, currentIndex + 1)}
              >
                <Text
                  style={
                    currentIndex === bookAllDirectory.length
                      ? 'color: rgb(124, 124, 124)'
                      : ''
                  }
                >
                  下一章
                </Text>
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
                {showDirectory &&
                  bookDirectory.map((item, index) => {
                    return (
                      <AtListItem
                        key={item._id}
                        title={item.title}
                        className={
                          index === currentIndex ? 'drawer-actived' : ''
                        }
                        onClick={this.jumpToChapter.bind(this, index)}
                      />
                    )
                  })}
              </AtList>
            </ScrollView>
          </AtDrawer>
        </View>
      )
    }
  }
}

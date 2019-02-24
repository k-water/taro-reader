import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtInput, AtIcon, AtTag, AtList, AtListItem } from 'taro-ui'
import { request } from '../../../utils'
import bookSearch from '../../../static/icon/book-search.png'
import deleteHistory from '../../../static/icon/delete-history.png'
import './index.scss'

export default class BookSearch extends Component {
  config = {
    navigationBarTitleText: '搜索'
  }

  constructor() {
    super(...arguments)
    this.state = {
      searchVal: '',
      searchHotWords: [],
      newHotWords: [],
      searchKeywords: [],
      windowHehigt: 0,
      searchHistory: [],
      isLoading: true
    }
  }

  componentDidShow() {
    const res = Taro.getSystemInfoSync()
    this.setState({
      windowHehigt: res.windowHeight
    })
    let hasStoraged = null
    try {
      hasStoraged = Taro.getStorageSync('search-history-BOOK')
      if (hasStoraged) {
        hasStoraged = JSON.parse(hasStoraged)
        this.setState({
          searchHistory: hasStoraged
        })
      }
    } catch (e) {
      throw e
    }
  }

  componentDidMount() {
    this.getInitData()
  }

  getInitData() {
    Taro.showLoading({
      title: '加载中...'
    })
    const getSearchHotWord = request({
      url: '/rapi/book/search-hotwords'
    })
    const getHotWord = request({
      url: '/rapi/book/hot-word'
    })

    Promise.all([getSearchHotWord, getHotWord])
      .then(resList => {
        this.setState({
          searchHotWords: resList[0].searchHotWords,
          newHotWords: resList[1].newHotWords,
          isLoading: false
        })
        Taro.hideLoading()
      })
      .catch(err => {
        throw err
      })
  }

  getAutoCompleteWord(word) {
    request({
      url: '/rapi/book/auto-complete',
      data: {
        query: word
      }
    })
      .then(res => {
        this.setState({
          searchKeywords: res.keywords
        })
      })
      .catch(err => {
        throw err
      })
  }

  handleSearchChange(val) {
    this.setState({
      searchVal: val
    })
    this.getAutoCompleteWord(val)
  }

  jumpToResultPage(word) {
    if(!word) {
      return
    }
    Taro.navigateTo({
      url: `/subpages/book/searchResult/index?word=${word}`
    })
    this.storageSearchWord(word)
  }

  storageSearchWord(word) {
    let hasStoraged = null
    try {
      hasStoraged = Taro.getStorageSync('search-history-BOOK')
      if (hasStoraged) {
        hasStoraged = JSON.parse(hasStoraged)
        if (hasStoraged.length >= 5) {
          hasStoraged.pop()
        }
      } else {
        hasStoraged = []
      }
    } catch (e) {
      throw e
    }
    if (!hasStoraged.includes(word)) {
      hasStoraged.unshift(word)
      Taro.setStorage({
        key: 'search-history-BOOK',
        data: JSON.stringify(hasStoraged)
      })
        .then()
        .catch(err => {
          throw err
        })
    }
  }

  deleteSearchHistory() {
    let hasStoraged = null
    try {
      hasStoraged = Taro.getStorageSync('search-history-BOOK')
      if (hasStoraged) {
        this.setState({
          searchHistory: []
        })
        Taro.removeStorage({
          key: 'search-history-BOOK'
        })
          .then()
          .catch(err => {
            throw(err)
          })
      }
    } catch(e) {
      throw(e)
    }
  }

  render() {
    const {
      searchVal,
      searchHotWords,
      newHotWords,
      searchKeywords,
      windowHehigt,
      searchHistory,
      isLoading
    } = this.state
    if (!isLoading) {
      return (
        <View className='search-container'>
          <View className='book-search'>
            <AtIcon
              className='search-icon'
              value='search'
              size='18'
              color='rgb(135, 142, 147)'
            />
            <AtInput
              border={false}
              placeholder='搜索'
              value={searchVal}
              onChange={this.handleSearchChange}
              onConfirm={this.jumpToResultPage.bind(this, searchVal)}
            />

            <View
              className='word-complete'
              style={
                searchKeywords.length > 0
                  ? `height: ${windowHehigt - 44}PX`
                  : 'height: 0PX'
              }
            >
              <AtList hasBorder={false}>
                {searchKeywords &&
                  searchKeywords.map(item => {
                    return (
                      <AtListItem
                        key={item}
                        title={item}
                        hasBorder={false}
                        thumb={bookSearch}
                        onClick={this.jumpToResultPage.bind(this, item)}
                      />
                    )
                  })}
              </AtList>
            </View>
          </View>

          <View className='search-word'>
            <View className='header-tips'>
              <Text>搜索热词</Text>
            </View>
            <View className='word-tag'>
              {searchHotWords &&
                searchHotWords.slice(0, 10).map(item => {
                  return (
                    <AtTag
                      circle
                      key={item.word}
                      onClick={this.jumpToResultPage.bind(this, item.word)}
                    >
                      {item.word}
                    </AtTag>
                  )
                })}
            </View>
          </View>

          <View className='search-word'>
            <View className='header-tips'>
              <Text>热门推荐</Text>
            </View>
            <View className='word-tag'>
              {newHotWords &&
                newHotWords.slice(0, 5).map(item => {
                  return (
                    <AtTag
                      circle
                      key={item.word}
                      onClick={this.jumpToResultPage.bind(this, item.word)}
                    >
                      {item.word}
                    </AtTag>
                  )
                })}
            </View>
          </View>

          <View className='search-history'>
            <View className='header-tips'>
              <View className='history-title'>搜索历史</View>
              <View className='del-history' onClick={this.deleteSearchHistory}>
                删除历史
                <Image
                  mode='aspectFill'
                  src={deleteHistory}
                />
              </View>
            </View>
            <View className='history-content'>
              <AtList hasBorder={false}>
                {searchHistory &&
                  searchHistory.map(item => (
                    <AtListItem
                      key={item}
                      title={item}
                      hasBorder={false}
                      onClick={this.jumpToResultPage.bind(this, item)}
                    />
                  ))}
              </AtList>
            </View>
          </View>
        </View>
      )
    }
  }
}

import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import Index from './pages/index'
import './app.scss'

class App extends Component {

  config = {
    pages: [
      // 'subpages/book/read/index',
      'pages/index/index',
      'pages/class/index',
      'pages/book/index',
      'pages/person/index',
    ],
    subpackages: [
      {
        root: 'subpages/details/',
        pages: [
          'classifyDetail/index',
          'booklistDetail/index',
          'rankingDetail/index',
          'bookDetail/index',
          'bookInfo/index'
        ]
      },
      {
        root: 'subpages/showAll/',
        pages: [
          'bookList/index',
          'featuredList/index'
        ]
      },
      {
        root: 'subpages/book/',
        pages: [
          'read/index'
        ]
      }
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: '#000000',
      borderStyle: 'white',
      selectedColor: '#1296db',
      list: [
        {
          pagePath: 'pages/index/index',
          text: '发现',
          iconPath: './static/icon/find.png',
          selectedIconPath: './static/icon/find-selected.png'
        },
        {
          pagePath: 'pages/class/index',
          text: '分类',
          iconPath: './static/icon/class.png',
          selectedIconPath: './static/icon/class-selected.png'
        },
        {
          pagePath: 'pages/book/index',
          text: '书架',
          iconPath: './static/icon/book.png',
          selectedIconPath: '/static/icon/book-selected.png'
        },
        {
          pagePath: 'pages/person/index',
          text: '我',
          iconPath: './static/icon/person.png',
          selectedIconPath: './static/icon/person-selected.png'
        },
      ]
    },
    networkTimeout: {
      request: 10000,
      downloadFile: 10000
    },
    debug: true
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

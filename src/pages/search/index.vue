<template>
  <div>
    <header class="header" ref="header">
      <div class="header__top">
        <div class="header__search" >
          <svg aria-hidden="true" class="header__search__icon"><use xlink:href="#icon-sousuo"></use></svg>
          <div class="header__search__text">
            <input type="text" class="header__search__text__input"
              :placeholder="placeholder"
              v-model="searchText"
              @input="onInput"
              @keypress="onKeyPress"
            >
          </div>
        </div>
        <div class="header__btn" @click="onBack">
          取消
        </div>
      </div>
      <div class="header__bottom" v-if="searching">
        <header-nav-bar :activeIdx="navActiveIdx" :autoWidth="false" :navItems="navItems" :hasDropdown="false" @click="onNavClick"></header-nav-bar>
      </div>
    </header>
    <main class="main">
      <div class="main__result" v-if="searching">
        <router-view />
      </div>
      <scroll-view :height="mainHeight" style="overflow: hidden;" v-else>
        <div class="main__default" v-if="!inputing">
          <div class="content">
            <div class="content__title">{{popTitle}}</div>
            <div class="content__item__wrapper">
              <div class="content__item" v-for="(item, idx) in popItems" :key="idx" @click="onSearch(item)">
                {{item}}
              </div>
            </div>
          </div>
          <div class="content">
            <div class="content__title">{{hisTitle}}</div>
            <div class="content__item__wrapper history">
              <div class="content__item" v-for="(item, idx) in hisItems" :key="idx" @click="onSearch(item)">
                <img class="content__item__icon" src="//s1.hdslb.com/bfs/static/mult/images/history.png" alt="历史记录">
                {{item}}
              </div>
            </div>
            <p class="content__clear" v-if="hisItems.length > 0" @click="onClear">清空历史记录</p>
          </div>
        </div>
        <div class="main__suggest">
          <p class="suggest-item" v-for="(sug, sugIdx) in suggests" :key="sugIdx" @click="onSearch(sug)">
            {{sug}}
          </p>
        </div>
      </scroll-view>
    </main>
  </div>
</template>

<script>
import ScrollView from '@/components/ScrollView'
import HeaderNavBar from '@/components/HeaderNavBar'

const store = {
  id: -1,
  arr: [],
  size: 6,
  set (arr) {
    this.arr = arr
    return this
  },
  push (item) {
    const id = ++this.id
    const ele = {id, item}
    if (id < this.size) {
      this.arr.push(ele)
    } else {
      const minId = this._findMinId()
      this.arr[minId] = ele
    }
    return this
  },
  _findMinId () {
    let minId = this.arr[0].id

    this.arr.forEach(ele => {
      if (minId > ele.id) {
        minId = ele.id
      }
    })

    return minId
  },
  get (isSort) {
    return isSort ? this.arr.slice().sort((a, b) => a.id > b.id) : this.arr
  },
  getNoId (isSort) {
    const arr = this.get(isSort)
    return arr.map(item => item.item)
  }
}

export default {
  components: {
    ScrollView,
    HeaderNavBar
  },
  data () {
    return {
      mainHeight: 0,
      navActiveIdx: 0,
      placeholder: '',
      inputing: false,
      searching: false,
      popTitle: '大家都在搜',
      popItems: [],
      hisTitle: '历史搜索',
      hisItems: [],
      suggests: [],
      navItems: [
        {
          text: '综合',
          url: './default'
        },
        {
          text: '番剧(0)',
          url: './fanjv'
        },
        {
          text: 'UP主(0)',
          url: './up'
        },
        {
          text: '影视(0)',
          url: './movie'
        }
      ]
    }
  },
  computed: {
    searchText: {
      set (text) {
        return this.$store.dispatch('searchText', text)
      },
      get () {
        return this.$store.state.searchText
      }
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.calMainHeight()
    this.saveHistory()
    next()
  },
  methods: {
    onBack () {
      this.searching = false
      this.$router.back()
    },
    onResultRefresh () {
      this.$refs.result.refresh()
    },
    onPullUp () {
      this.$bus.$emit('pullup')
    },
    onNavClick ({idx}) {
      const viewMap = ['Default', 'Fanjv', 'Up', 'Movie']
      this.navActiveIdx = idx
      this.onSearch(this.searchText, viewMap[idx])
    },
    onClear () {
      window.localStorage.removeItem('searchHis')
      this.getHistory()
    },
    calMainHeight () {
      this.mainHeight = window.innerHeight - this.$refs.header.offsetHeight
      this.$bus.data.mainHeight = this.mainHeight
    },
    onSearch (text, view = 'Default', viewData) {
      this.searching = true
      this.searchText = text
      this.$router.push({
        name: `PageSearch${view}`,
        query: { keyword: text }
      })
    },
    onInput (e) {
      if (this.searchText !== '') {
        this.inputing = true
        document.body.style.backgroundColor = 'rgb(244, 244, 244)'
        this.getSuggests()
      } else {
        this.searching = false
        this.inputing = false
        this.getHistory()
        document.body.style.backgroundColor = '#fff'
      }
    },
    saveHistory () {
      const searchText = this.searchText
      window.localStorage.setItem('searchHis', JSON.stringify(store.push(searchText).get()))
    },
    getHistory () {
      var hisItems = JSON.parse(window.localStorage.getItem('searchHis'))
      if (Array.isArray(hisItems)) {
        this.hisItems = store.set(hisItems).getNoId(true)
      } else {
        this.hisItems = []
      }
    },
    getSuggests () {
      const searchText = this.searchText
      // console.log(searchText)
      this.$axios
        .get('https://s.search.bilibili.com/main/suggest', {
          params: {
            func: 'suggest',
            suggest_type: 'accurate',
            term: searchText,
            sub_type: 'tag',
            tag_name: 10,
            main_ver: 'v1'
          }
        })
        .then(resData => {
          let tags = resData.result.tag
          if (tags) {
            this.suggests = tags.map(tag => tag.value)
          }
        })
    },
    onKeyPress (e) {
      if (e.key === 'Enter') {
        this.saveHistory()
        this.onSearch(this.searchText)
      }
    },
    setNavItems (topList) {
      const items = this.navItems
      topList.forEach((topItem, idx) => {
        let item = items[idx + 1]
        item.text = item.text.replace(/\d+/, topItem)
      })
    },
    setNavActiveIdx (idx) {
      this.navActiveIdx = idx
    }
  },
  mounted () {
    this.calMainHeight()
    this.getHistory()
    this.$bus.$on('calMainHeight', this.calMainHeight)
    this.$bus.$on('update:topList', this.setNavItems)
    this.$bus.$on('update:navActiveIdx', this.setNavActiveIdx)
    this.$axios
      .get('/api/x/web-interface/search/default')
      .then(resData => {
        this.placeholder = resData.data.show_name
      })
    this.$axios
      .get('/search/main/hotword')
      .then(resData => {
        const list = resData.list
        this.popItems = list.map(item => item.keyword)
      })
  },
  destroyed () {
    this.$bus.$off('calMainHeight', this.calMainHeight)
    this.$bus.$off('update:topList', this.setNavItems)
    this.$bus.$off('update:navActiveIdx', this.setNavActiveIdx)
  }
}
</script>

<style lang="scss" scoped>
// view common
@import './common';
$bg-color: $c-bg-white;
$search-header-icon-size: 44px;
$default-bg-color: $c-bg-whitef4;
$border-color: rgb(204, 204, 204);
$icon-size: 32px;

html, body {
  width: 100%;
  height: 100%;
}
body {
  background-color: $bg-color;
}
.header {
  position: relative;
  z-index: 99;
  background-color: $bg-color;
  &__top {
    display: flex;
    align-items: center;
    height: 88px;
    padding: 0 25px;
  }
  &__search {
    display: flex;
    align-items: center;
    width: 618px;
    height: 60px;
    background-color: $default-bg-color;
    &__icon {
      width: $search-header-icon-size;
      height: $search-header-icon-size;
      margin: 0 20px;
      fill: $c-icon-gray;
    }
    &__text {
      width: 618px;
      font-size: $t-md;
      color: $c-t-black;
      &__input {
        width: 100%;
        border: 0;
        background-color: $c-bg-whitef4;
        outline: none;
      }
    }
  }
  &__btn {
    flex: 1;
    line-height: 88px;
    text-align: center;
    font-size: 28px;
    color: #fb7299;
  }
}
.header__bottom {
  /deep/ .header-nav__nav {
    display: flex;
    justify-content: space-between;
    padding: 48px 0;
    margin: 0 40px;
    width: auto;
    &__wrapper {
      width: 100%;
      height: auto;
      padding-top: 0;
    }
    &__item {
      margin-right: 0;
    }
  }
}
.main__default {
  background-color: $default-bg-color;
  .content {
    padding-left: 25px;
    margin-bottom: 20px;
    background-color: $bg-color;
    &__title {
      padding-top: 32px;
      font-size: $t-md;
      color: $c-t-gray;
    }
    &__item {
      display: inline-block;
      padding: 19px 22px;
      margin-top: 17px;
      margin-right: 24px;
      border: 2px solid $border-color;
      font-size: $t-md;
      border-radius: 32px;
      color: $c-t-black;
      &__wrapper {
        overflow: hidden;
        padding-top: 8px;
        padding-bottom: 32px;
      }
      &__wrapper.history {
        padding-bottom: 0;
        .content__item {
          display: flex;
          align-items: center;
          height: 88px;
          padding: 0;
          border: 0;
          border-bottom: 2px solid $border-color;
          border-radius: 0;
          &__icon {
            width: $icon-size;
            height: $icon-size;
            margin-right: 18px;
          }
        }
      }
    }
    &__clear {
      line-height: 92px;
      margin: 0;
      margin-left: -25px;
      text-align: center;
      font-size: $t-md;
      color: $c-t-gray;
    }
  }
}
.main__suggest {
  .suggest-item {
    display: block;
    line-height: 88px;
    margin-left: 24px;
    font-size: $t-sm;
    border-bottom: 2px solid $border-color;
    text-decoration: none;
    color: $c-t-black1;
  }
}
.main__result {
  margin: 0 -25px;
  padding: 0 25px;
}
</style>

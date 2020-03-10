<template>
  <div>
    <header class="header" ref="header">
      <my-header class="header__header"></my-header>
      <header-nav-bar
        :navItems="barNavItems"
        :subNavItems="barSubNavItems"
        :activeIdx="activeNavIdx"
        :subActiveIdx="activeSubNavIdx"
      >
      </header-nav-bar>
    </header>
    <scroll-view :height="mainHeight">
      <div class="main">
        <div class="part" v-for="(r, rIdx) in recommends" :key="rIdx">
          <div class="part__title__wrap">
            <h3 class="part__title">{{r.title}}</h3>
            <div
              :class="[
                'part__title__link',
                {'part__title__link--home': isRecommendPage && rIdx === 0}
              ]"
            >
              <svg aria-hidden="true" class="part__title__link__rank">
                <use xlink:href="#icon-paihangbang1"></use>
              </svg>
              <span class="part__title__link__text">
                {{isRecommendPage ? '排行榜' : '查看更多'}}
              </span>
              <svg aria-hidden="true" class="part__title__link__arrow">
                <use xlink:href="#icon-gengduo"></use>
              </svg>
            </div>
          </div>
          <div class="recommend">
            <div class="recommend__video" v-for="(v, vIdx) in r.videos" :key="vIdx">
              <router-link :to="`/video/av${v.aid}`">
                <video-item
                  class="recommend__video__item"
                  :aid="v.aid + ''"
                  :pron="v.title"
                  :watch="v.play"
                  :danmu="v.video_review"
                  :imgSrc="v.pic"
                >
                </video-item>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import MyHeader from '@/components/Header'
import HeaderNavBar from '@/components/HeaderNavBar'
import VideoItem from '@/components/VideoItem'
import ScrollView from '@/components/ScrollView'
import navItems from '../navItems'

const getRidByUrl = (url) => {
  return url.split('/').pop()
}

const getNavItem = (rid, items = navItems) => {
  for (let key = 0, len = items.length; key < len; key++) {
    const val = items[key]
    const curRid = getRidByUrl(val.url)
    if (curRid === rid) {
      const subNavItems = val.subNavItems
      if (subNavItems) {
        subNavItems.forEach(item => {
          item.rid = getRidByUrl(item.url)
        })
      }
      return {key, val, rid: curRid, children: subNavItems}
    } else {
      const subNavItems = val.subNavItems
      if (subNavItems) {
        const navItem = getNavItem(rid, subNavItems)
        if (navItem) return {...navItem, parent: {key, val, rid: curRid}}
      } else {
        val.rid = curRid
        val.key = key
      }
    }
  }
}

export default {
  components: {
    MyHeader,
    HeaderNavBar,
    VideoItem,
    ScrollView
  },
  data () {
    return {
      mainHeight: 0,
      activeNavIdx: 0,
      activeSubNavIdx: 0,
      navItem: {},
      barNavItems: navItems,
      barSubNavItems: [],
      recommends: [],
      rid: 0
    }
  },
  computed: {
    isRecommendPage () {
      return this.activeSubNavIdx === 0
    }
  },
  methods: {
    setMainHeight () {
      this.mainHeight = window.innerHeight - this.$refs.header.offsetHeight
    },
    setNavItems () {
      const rid = this.rid
      const navItem = getNavItem(rid)
      this.navItem = navItem
      if (navItem.parent) {
        this.activeNavIdx = navItem.parent.key
        this.activeSubNavIdx = navItem.key
        this.barSubNavItems = navItem.parent.val.subNavItems
      } else {
        this.activeNavIdx = navItem.key
        this.barSubNavItems = navItem.children
      }
    },
    getRegion (rid, day = 7, custom = {isSave: true}) {
      return this.$axios.get('/api/x/web-interface/ranking/region', {
        params: {
          rid: rid,
          day,
          jsonp: 'jsonp'
        },
        custom
      })
    },
    getArchiveRank (tid, pn, day = 7, custom = {isSave: true}) {
      return this.$axios.get('/api/archive_rank/getarchiverankbypartion', {
        params: {
          tid,
          pn,
          jsonp: 'jsonp'
        },
        custom
      })
    },
    loadData () {
      const navItem = this.navItem
      let promises = []
      function getEvenVideos (videos) {
        if (videos.length % 2 !== 0) {
          videos.pop()
        }
        return videos
      }
      // recommend in this channel
      if (navItem.children) {
        promises.push(this.getRegion(navItem.rid))
        navItem.children.forEach(child => {
          promises.push(this.getRegion(child.rid, 3))
        })
        Promise.all(promises).then(result => {
          this.recommends = result.map((resData, idx) => {
            return {
              title: idx === 0 ? '热门推荐' : this.barSubNavItems[idx - 1].text,
              videos: getEvenVideos(resData.data.slice(0, 4))
            }
          })
        })
      } else {
        promises = [
          this.getRegion(navItem.rid),
          this.getArchiveRank(navItem.rid)
        ]
        Promise.all(promises).then(result => {
          this.recommends = result.map((resData, idx) => {
            return {
              title: idx === 0 ? '热门推荐' : '最新视频',
              videos: getEvenVideos(idx === 0 ? resData.data : resData.data.archives)
            }
          })
        })
      }
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.rid = to.params.rid
    this.setNavItems()
    this.loadData()
    next()
  },
  mounted () {
    this.rid = this.$route.params.rid
    this.setMainHeight()
    this.setNavItems()
    this.loadData()
  }
}
</script>

<style lang="scss" scoped>
$swiper-bullet-size: 10px;
$swiper-bullet-active-bg-color: #de698c;
$rank-color: #ffa726;

.header {
  position: relative;
  z-index: 2;
  width: 100%;
  &__header {
    position: relative;
    z-index: 2;
    background-color: $c-bg-white;
  }
}
.main {
  padding: 70px 24px 0 24px;
}
.part {
  &__title {
    font-size: $t-lg;
    font-weight: 400;
    color: $c-t-black1;
    &__wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &__link {
      display: none;
      &__text {
        font-size: $t-sm;
      }
      &__arrow {
        width: 28px;
        height: 24px;
        fill: $c-icon-gray;
      }
      &__rank {
        width: 64px;
        height: 38px;
      }
      &--home {
        display: flex;
        color: $rank-color;
        align-items: center;
        .part__title__link {
          &__rank {
            fill: $rank-color;
          }
        }
      }
    }
  }
}
.recommend__video__item {
  color: $c-t-black1;
}
</style>

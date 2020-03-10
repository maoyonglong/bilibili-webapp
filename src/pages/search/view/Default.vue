<template>
  <search-view
    ref="view"
    :basename="basename"
    :searchType="searchType"
    :axiosParams="axiosParams"
    @update:resData="onUpdateResData"
    @onPullup="onPullUp"
  >
    <div class="result__default">
      <ul class="default__nav" @click="onResNav">
        <li class="default__nav__item" v-for="(resItem, resIdx) in resNavItems" :key="resIdx">
          <a :class="['default__nav__item__link', {keyword: resActiveIdx === resIdx}]" :data-idx="resIdx">{{resItem}}</a>
        </li>
      </ul>
      <div class="default__fanjv__wrapper" v-if="fanjvs && fanjvs.length > 0 && resActiveIdx === 0">
        <fanjvs :fanjvs="fanjvs"></fanjvs>
        <div class="default__fanjv__divider">
          <img class="default__fanjv__divider__line" src="//s1.hdslb.com/bfs/static/mult/images/lineR.png"/>
          <span class="default__fanjv__divider__text" @click="onMoreFanjv">查看更多番剧</span>
          <img src="//s1.hdslb.com/bfs/static/mult/images/enter.png" alt="" class="default__fanjv__divider__icon">
          <img class="default__fanjv__divider__line" src="//s1.hdslb.com/bfs/static/mult/images/lineR.png" />
        </div>
      </div>
      <div class="default__video__wrapper" v-if="videos && videos.length > 0">
        <ul class="default__video">
          <li class="search-display__item" v-for="(v, vIdx) in videos" :key="vIdx">
            <div class="search-display__item__left">
              <img v-lazy="v.pic" alt="" class="search-display__item__img">
              <span class="default__video__item__duration">{{v.duration}}</span>
            </div>
            <div class="search-display__item__right">
              <h3 class="search-display__item__title" v-html="v.title"></h3>
              <div class="default__video__item__up">
                <img src="//s1.hdslb.com/bfs/static/mult/images/ico_up.png" alt="" class="default__video__item__icon">
                {{v.author}}
              </div>
              <div class="search-display__item__unit__wrapper">
                <div class="search-display__item__unit">
                  <img src="//s1.hdslb.com/bfs/static/mult/images/ico_play.png" alt="" class="default__video__item__icon">
                  <span class="search-display__item__unit__text">{{chinaUnitNum(v.play, { ignore: ['百', '千'], decimal: 1 })}}</span>
                </div>
                <div class="search-display__item__unit">
                  <img src="//s1.hdslb.com/bfs/static/mult/images/ico_danmu.png" alt="" class="default__video__item__icon">
                  <span class="search-display__item__unit__text">{{chinaUnitNum(v.review, { ignore: ['百', '千'], decimal: 1 })}}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </search-view>
</template>

<script>
import chinaUnitNum from '@/china-unit-num'
import SearchView from '../components/View'
import Fanjvs from '../components/Fanjv'

export default {
  components: {
    SearchView,
    Fanjvs
  },
  data () {
    return {
      resActiveIdx: 0,
      resNavItems: ['默认排序', '播放多', '新发布', '弹幕多'],
      fanjvs: [],
      videos: [],
      topList: null,
      axiosParams: {},
      basename: 'all/v2',
      searchType: 'all'
    }
  },
  computed: {
    isDefaultPage () {
      return this.resActiveIdx === 0
    }
  },
  methods: {
    chinaUnitNum,
    onMoreFanjv () {
      this.$bus.$emit('update:navActiveIdx', 1)
      this.$router.push({name: 'PageSearchFanjv'})
    },
    onResNav (e) {
      let target = e.target
      const nodeName = target.nodeName
      if (nodeName === 'UL') return
      if (nodeName === 'LI') {
        target = target.childNode
      }
      this.resActiveIdx = parseInt(target.dataset.idx)
      this.videos = []
      this.setViewParams()
      this.$refs.view.page = 1
      // 改变props需要时间更新
      this.$nextTick(() => {
        this.$refs.view.loadData()
      })
    },
    setViewParams () {
      let params = {}
      if (!this.isDefaultPage) {
        const orderMap = ['click', 'pubdate', 'dm']
        this.basename = 'type'
        this.searchType = 'video'
        params.search_type = 'video'
        params.order = orderMap[this.resActiveIdx - 1]
      } else {
        this.basename = 'all/v2'
        this.searchType = 'all'
      }
      this.axiosParams = params
    },
    onUpdateResData (resData) {
      const data = resData.data
      const result = data.result
      const topList = data.top_tlist
      let curVideos = []
      if (this.isDefaultPage) {
        this.fanjvs = result[3].data
        curVideos = result[8].data
        this.topList = topList
      } else {
        curVideos = result
      }
      this.videos = this.videos.concat(curVideos)
      this.sendTopList(topList)
    },
    onPullUp () {
      this.$refs.view.loadData()
    },
    sendTopList (topList) {
      if (topList) {
        this.topList = [topList.media_bangumi, topList.bili_user, topList.media_ft]
        this.$bus.$emit('update:topList', this.topList)
      }
    }
  }
}
</script>

<style lang="scss">
@import '../common';

.result__default {
  background-color: #f4f4f4;
}
.default {
  &__nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 88px;
    padding: 0 40px;
    background-color: #f9f9f9;
    &__item {
      &__link {
        color: $c-t-black75;
        // &.active {
        //   color: $header-nav-nav-item-active-color;
        // }
      }
    }
  }
  &__fanjv {
    &__wrapper {
      padding-left: $wrapper-padding-left;
    }
    &__divider {
      display: flex;
      align-items: center;
      height: $fanjv-divider-height;
      padding: $fanjv-divider-padding--vertical 0;
      font-size: $fanjv-divider-font-size;
      color: $fanjv-divider-color;
      &__text {
        margin-left: $fanjv-divider-text-margin-left;
      }
      &__line {
        width: 32.7%;
        height: 1px;
      }
      &__icon {
        width: 44px;
        height: 44px;
      }
    }
  }
  &__video {
    margin-top: 0;
    &__wrapper {
      padding-top: 20px;
      padding-left: $wrapper-padding-left;
    }
    &__item {
      &__duration {
        position: absolute;
        right: 8px;
        bottom: 8px;
        padding: 4px;
        border-radius: 4px;
        color: #fff;
        background-color: rgba(0, 0, 0, .3);
      }
      &__up {
        display: flex;
        align-items: center;
        margin: 14px 0;
      }
      &__icon {
        width: $video-default-icon-width;
        height: $video-default-icon-height;
        margin-right: $video-default-icon-margin-right;
      }
    }
  }
}

.keyword {
  color: #fb7299;
}
em {
  font-style: normal;
  font-weight: normal;
}
</style>

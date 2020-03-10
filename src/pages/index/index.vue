<template>
  <div>
    <header class="header" ref="header">
      <my-header class="header__header"></my-header>
      <header-nav-bar :navItems="navItems" :subNavItems="subNavItems" :activeIdx="activeNavIdx"></header-nav-bar>
    </header>
    <scroll-view :height="mainHeight" :bounce="false" :pullup="true" @scrollToEnd="loadMore">
      <div class="main">
        <div class="banner">
          <swiper class="banner__swiper" :options="swiperOption" ref="mySwiper">
            <!-- slides -->
            <swiper-slide v-for="(slide, slideIdx) in bannerSlides" :key="slideIdx">
              <router-link to="" class="banner__swiper__link">
                <img class="banner__swiper__link__image" :src="slide.src">
              </router-link>
            </swiper-slide>
            <!-- Optional controls -->
            <div class="swiper-pagination"  slot="pagination"></div>
          </swiper>
        </div>
        <div class="recommend">
          <video-item
            class="recommend__video"
            v-for="(video, videoIdx) in videoData"
            :key="videoIdx"
            v-bind="video"
          ></video-item>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import MyHeader from '@/components/Header'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import HeaderNavBar from '@/components/HeaderNavBar'
import VideoItem from '@/components/VideoItem'
import ScrollView from '@/components/ScrollView'
import navItems from '../navItems'

export default {
  components: {
    MyHeader,
    HeaderNavBar,
    swiper,
    swiperSlide,
    VideoItem,
    ScrollView
  },
  data () {
    return {
      mainHeight: 0,
      activeNavIdx: 0,
      navItems: [],
      subNavItems: [],
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        autoplay: true
      },
      bannerSlides: [],
      // videoItems: [],
      videoItemsStart: 0,
      videoData: []
    }
  },
  methods: {
    loadMore () {
      this.videoItemsStart++
      this.pushVideoData()
    },
    pushVideoData () {
      const loadNum = 10
      const videoItems = this.videoItems
      const startIdx = this.videoItemsStart * loadNum
      for (let i = startIdx, len = videoItems.length; i < len && i < startIdx + loadNum; i++) {
        this.videoData.push(videoItems[i])
      }
    }
  },
  created () {
    const curNavItems = navItems
    this.navItems = curNavItems
  },
  mounted () {
    const header = this.$refs.header
    this.mainHeight = window.innerHeight - header.offsetHeight
    const axios = this.$axios
    // banner
    axios
      .get('/api/x/web-show/res/loc?jsonp=jsonp&pf=7&id=1695')
      .then(resData => {
        this.bannerSlides = resData.data.map(item => {
          return {
            src: item.pic
          }
        })
      })
    // video
    axios
      .get('/api/x/web-interface/ranking?rid=36&day=3&jsonp=jsonp')
      .then(resData => {
        this.videoItems = resData.data.list.map(item => {
          return {
            watch: item.play,
            danmu: item.video_review,
            imgSrc: item.pic,
            imgAlt: item.title,
            pron: item.title,
            aid: item.aid,
            loading: false
          }
        })
        this.pushVideoData()
      })
  }
}
</script>

<style lang="scss" scoped>
$swiper-bullet-size: 10px;
$swiper-bullet-active-bg-color: #de698c;

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
  padding: 0 24px;
  .banner {
    height: 220px;
    overflow: hidden;
    &__swiper {
      height: 100%;
      /deep/ .swiper-pagination-bullets {
        right: 0;
        bottom: 9px;
        margin: auto;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 14%;
        height: 25px;
        border-radius: 15px;
        background-color: rgba(0,0,0,.5);
      }
      /deep/ .swiper-pagination-bullet {
        width: $swiper-bullet-size;
        height: $swiper-bullet-size;
        background-color: $c-bg-white;
        opacity: 1;
        &-active {
          background-color: $swiper-bullet-active-bg-color;
        }
      }
      &__link {
        display: block;
        height: 100%;
        &__image {
          width: 100%;
          height: 100%;
          border-radius: 20px;
        }
      }
    }
  }
}
</style>

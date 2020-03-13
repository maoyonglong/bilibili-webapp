<template>
  <div>
    <my-header ref="header"></my-header>
    <scroll-view :height="mainHeight" ref="scrollView">
      <main class="main">
        <div class="video-face">
          <img v-lazy="video.pic" alt="" class="video-face__img" :key="video.pic">
          <span class="video-face__aid">av{{video.aid}}</span>
          <span class="video-face__play"></span>
          <!-- <span class="video-face__duration"></span> -->
        </div>
        <div class="video-in-app"></div>
        <div class="video-info">
          <div class="video-info__title">
            <!-- <div class="video-info__title__icon__wrapper" v-if="infoIcon">
              <svg aria-hidden="true" class="video-info__title__icon"><use :xlink:href="infoIconHref" v-if="noEmptyStr(noEmptyStr)"></use></svg>
              <span class="video-info__title__icon__text">{{noEmptyStr(infoIconText)}}</span>
            </div> -->
            <h1 :class="['video-info__title__text', 'ellipsis', {'video-info__title__text--unfold': unfold}]">{{video.title}}</h1>
            <svg
              aria-hidden="true"
              :class="['video-info__title__dropdown', {'video-info__title__dropdown--unfold': unfold}]"
              @click="onDropdown">
              <use xlink:href="#icon-xialada"></use>
            </svg>
          </div>
          <div class="video-info__unit">
            <router-link to class="video-info__unit__item video-info__unit__author">
              {{video.author}}
            </router-link>
            <span class="video-info__unit__item">{{video.play}}次观看</span>
            <span class="video-info__unit__item">{{video.video_review}}弹幕</span>
            <!-- <span class="video-info__unit__item">{{date}}</span> -->
          </div>
          <div :class="['video-info__detail', {'video-info__detail--unfold': unfold}]">
            <p class="video-info__detail__statement">
              <svg class="video-info__detail__warn" data-name="\u56FE\u5C42 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#ff6262"><title>info_prohibit</title><path d="M3.42 4.13l.71-.71a6 6 0 0 1 8.46 8.46l-.71.71a6 6 0 0 1-8.46-8.46zm.71.71a5 5 0 0 0 7 7l-7-7zm.71-.71l7 7a5 5 0 0 0-7-7z"></path></svg>
              未经作者授权禁止转载
            </p>
            <p class="video-info__detail__content">
              {{video.description}}
            </p>
            <!-- <p class="video-info__detail__path"></p> -->
            <div class="video-info__detail__tag" @click="onTagClick">
              <a class="video-info__detail__tag__item" v-for="(tag, tagIdx) in tags" :key="tagIdx"  :data-id="tag.tag_id">{{tag.tag_name}}</a>
            </div>
          </div>
        </div>
        <div class="operator">
          <div class="operator__left">
            <div class="operator__item" v-for="(o, idx) in operatorsLeft" :key="idx">
              <svg aria-hidden="true" class="operator__item__icon">
                <use :xlink:href="'#icon-' + o.icon"></use>
              </svg>
              <span class="operator__item__text">{{o.text}}</span>
            </div>
          </div>
          <div class="operator__right">
            <div class="operator__item">
              <img class="operator__item__icon" src="/static/comment.png" />
              <span class="operator__item__text" @click="scrollToComment">{{video.comment}} 评论</span>
            </div>
          </div>
        </div>
        <div class="recommend">
          <div class="recommend__video__wrapper">
            <video-item
              v-for="(reco, recoIdx) in recommends"
              :key="recoIdx"
              class="recommend__video"
              :aid="reco.aid"
              :imgSrc="reco.pic"
              :pron="reco.title"
              :danmu="reco.stat.danmaku"
              :watch="reco.stat.view"
              :duration="reco.duration"
            >
            </video-item>
            <!-- <p>App 内打开</p> -->
          </div>
        </div>
        <div class="comment" v-lazy-container="{selector: 'img', loading: '/static/noface.gif'}">
          <h3 class="comment__title">
            评论
            <span class="comment__title__num">（ {{video.comment}} ）</span>
          </h3>
          <div class="comment__me comment__item">
            <img class="comment__item__avatar" :data-src="me ? me : '/static/noface.gif'">
            <div class="comment__me__say">说点什么吧</div>
          </div>
          <comment
            :comments="comments"
          >
          </comment>
        </div>
      </main>
    </scroll-view>
  </div>
</template>

<script>
import MyHeader from '@/components/Header'
import VideoItem from '@/components/VideoItem'
import ScrollView from '@/components/ScrollView'
import Comment from '@/components/Comment'

export default {
  components: {
    MyHeader,
    VideoItem,
    ScrollView,
    Comment
  },
  data () {
    return {
      me: '',
      mainHeight: 0,
      comments: [],
      video: {},
      recommends: [],
      tags: [],
      aid: '',
      operatorsLeft: [
        {
          icon: 'shoucangtianchong',
          text: '收藏'
        },
        {
          icon: 'download',
          text: '缓存'
        },
        {
          icon: 'share',
          text: '分享'
        }
      ],
      unfold: false
    }
  },
  methods: {
    calcMainHeight () {
      this.mainHeight = window.innerHeight - this.$refs.header.$el.offsetHeight
    },
    scrollToComment () {
      this.$refs.scrollView.scrollToElement('.comment', 200)
    },
    onTagClick (e) {
      const target = e.target
      if (target.nodeName === 'A') {
        // const tag = target.innerText
        const tagId = target.dataset.id
        this.$router.push({name: 'PageTag', params: { tagId }})
      }
    },
    onDropdown () {
      this.unfold = !this.unfold
    },
    loadData () {
      const aid = this.aid
      // comment
      this.$axios
        .get('/api/x/v2/reply', {
          params: {
            type: 1,
            sort: 2,
            oid: aid,
            pn: 1,
            nohot: 1
          }
        })
        .then(resData => {
          const data = resData.data
          const mid = data.upper.mid
          this.comments = data.replies.map(item => {
            return {
              ...item.member,
              ...item.content
            }
          })
          // video info
          this.$axios
            .get('/api/x/space/arc/search', {
              params: {
                pn: 1,
                ps: 1,
                order: 'rank',
                mid
              }
            })
            .then(resData => {
              const data = resData.data
              this.video = data.list.vlist[0]
            })
        })
      this.$axios
        .get('/api/x/web-interface/archive/related', {
          params: {
            aid
          }
        })
        .then(resData => {
          let data = resData.data
          if (data.length % 2 !== 0) {
            data.pop()
          }
          this.recommends = data
        })
      this.$axios
        .get('/api/x/tag/archive/tags', {
          params: {
            aid
          }
        })
        .then(resData => {
          this.tags = resData.data
        })
    }
  },
  mounted () {
    const params = this.$route.params
    this.aid = params.aid.replace('av', '')
    this.calcMainHeight()
    this.loadData()
  },
  beforeRouteUpdate (to, from, next) {
    this.aid = to.params.aid.replace('av', '')
    this.$refs.scrollView.scrollTo(0, 0)
    this.loadData()
    next()
  }
}
</script>

<style lang="scss" scoped>
$icon-size: 36px;
$me-avatar-size: 60px;
$warn-icon-size: 30px;
$transition-duration: 500ms;
$play-icon-size: 92px;

.main {
  position: relative;
}
.video {
  &-face {
    position: relative;
    z-index: 101;
    // height: 422px;
    color: $c-t-white;
    &__img {
      width: 100%;
      // height: 100%;
    }
    &__aid {
      position: absolute;
      top: 0;
      display: block;
      width: 100%;
      line-height: 64px;
      font-size: 30px;
      text-align: center;
    }
    &__play {
      position: absolute;
      bottom: 32px;
      right: 26px;
      display: block;
      width: 92px;
      height: 92px;
      background-image: url(/static/TV-Play.png);
      background-size: 100% auto;
    }
  }
  &-in-app {
    height: 100px;
    text-align: center;
    background: url(/static/play-in-app.png) no-repeat;
    background-size: 94%;
    background-position: center;
  }
  &-info {
    padding: 0 24px;
    &__title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &__text {
        font-size: 32px;
        color: $c-t-black;

        &--unfold {
          white-space: normal;
        }
      }
      &__dropdown {
        width: $icon-size;
        height: $icon-size;
        fill: $c-icon-gray;
        &--unfold {
          transition: transform $transition-duration;
          transform: rotateX(180deg);
        }
      }
    }
    &__unit {
      display: flex;
      &__item {
        margin-right: 12px;
        font-size: $t-sm;
        color: $c-t-gray;
      }
      &__author {
        font-weight: bold;
        color: $c-t-black75;
      }
    }
    &__detail {
      overflow: hidden;
      max-height: 0;
      font-size: $t-sm;
      color: $c-t-gray;
      transition: max-height $transition-duration;
      &--unfold {
        max-height: 1000px;
      }
      p {
        margin: 15px 0;
      }
      &__warn {
        display: inline-block;
        width: $warn-icon-size;
        height: $warn-icon-size;
      }
      &__content {
        line-height: 36px;
      }
      &__tag {
        overflow: hidden;
        padding-bottom: 24px;
        &__item {
          float: left;
          padding: 16px 36px;
          margin-right: 20px;
          margin-bottom: 12px;
          border-radius: 200px;
          font-size: $t-md;
          color: $c-t-black;
          background-color: $c-bg-whitef4;
        }
      }
    }
  }
}
.operator {
  display: flex;
  justify-content: space-between;
  padding: 22px 36px;
  &__left, &__right {
    display: flex;
  }
  &__item {
    display: flex;
    align-items: center;
    margin-right: 20px;
    &__icon {
      width: $icon-size;
      height: $icon-size;
      margin-right: 10px;
      fill: $c-icon-black;
    }
  }
}
.recommend {
  width: 100%;
  // height: 328px;
  padding: 0 20px;
  padding-top: 10px;
  box-sizing: border-box;
}
.comment {
  color: $c-t-black1;
  &__title {
    padding-left: 24px;
    font-weight: 400;
    font-size: $t-lg;
    &__num {
      color: $c-t-gray;
    }
  }
  &__item {
    display: flex;
    padding: 30px 24px;
    &__avatar {
      width: 80px;
      height: 80px;
      margin-right: 30px;
      border-radius: 50%;
    }
    &__info {
      &__author {
        font-size: $t-md;
        color: $c-t-gray;
      }
    }
    &__content {
      line-height: 38px;
      font-size: $t-lg;
    }
  }
  // override &__item
  &__me {
    padding-left: 30px;
    padding-right: 30px;
    .comment__me__say {
      flex: 1;
      line-height: 60px;
      padding: 0 20px;
      border-radius: 30px;
      color: silver;
      background-color: $c-bg-whitef4;
    }
    .comment__item__avatar {
      width: $me-avatar-size;
      height: $me-avatar-size;
    }
  }
}
</style>

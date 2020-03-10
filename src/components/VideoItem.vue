<template>
  <div class="video-item">
    <router-link :to="`/video/av${aid}`" class="video-item__top">
      <!-- <img v-if="loading" src="/static/tv.png" alt="loading" class="video-item__img"> -->
      <img v-lazy="imgSrc" :alt="imgAlt" class="video-item__img">
      <div class="video-item__unit">
        <div class="video-item__unit__item" v-for="(unit, unitIdx) in unitsData" :key="unitIdx">
          <svg class="video-item__unit__item__icon" aria-hidden="true">
            <use :xlink:href="unit.icon"></use>
          </svg>
          <span class="video-item__unit__item__text">{{unit.text}}</span>
        </div>
      </div>
    </router-link>
    <div class="video-item__bottom">
      <p>{{pron}}</p>
    </div>
  </div>
</template>

<script>
import chinaUnitNum from '@/china-unit-num'

export default {
  props: {
    imgSrc: String,
    imgAlt: {
      type: String,
      default: ''
    },
    aid: String | Number,
    watch: Number,
    danmu: Number,
    pron: String
  },
  computed: {
    unitsData () {
      const icons = {
        watch: 'bofangshu',
        danmu: 'danmushu'
      }
      const types = ['watch', 'danmu']
      const units = []
      types.forEach(type => {
        let text = this[type]
        if (type) {
          if (typeof text === 'number') {
            text = chinaUnitNum(text, { ignore: ['百', '千'], decimal: 1 })
          }
          units.push({type, text})
        }
      })
      return units.map(unit => ({icon: '#icon-' + icons[unit.type], text: unit.text}))
    }
  }
}
</script>

<style lang="scss">
$video-item-unit-text-font-size: 24px;

.video-item {
  &__top {
    position: relative;
    display: block;
    overflow: hidden;
    width: 100%;
    height: 212px;
    border-radius: 16px;
  }
  &__bottom {
    p {
      height: 64px;
      line-height: 32px;
      font-size: $t-md;

      @include lineClamp(2);
    }
  }
  &__img {
    display: block;
    width: 100%;
    height: 100%;
    background-color: #e7e7e7;
  }
  &__unit {
    position: absolute;
    bottom: 0;
    overflow: hidden;
    width: 100%;
    height: 32px;
    padding-left: 16px;
    &__item {
      display: inline-flex;
      align-items: center;
      float: left;
      height: 100%;
      &__icon,
      &__text {
        display: inline-block;
      }
      &__icon {
        margin-right: 12px;
        width: 24px;
        fill: $c-icon-white;
      }
      &__text {
        margin-right: 29px;
        font-size: $t-sm;
        color: $c-t-white;
      }
    }
  }
}
</style>

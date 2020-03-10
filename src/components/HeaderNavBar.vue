<template>
  <div class="header-nav__wrapper">
    <div
      v-for="idx in navs"
      :key="idx"
      :class="['header-nav', {'header-nav--menu': idx === 1, 'active': showNav}]"
      :style="showNav && idx === 1 ? 'transform: translateY(0)' : undefined"
    >
      <scroll-view :scrollX="true" class="header-nav__nav__wrapper">
        <ul class="header-nav__nav" @click="onClick" ref="nav">
          <li class="header-nav__nav__item" v-for="(navItem, navIdx) in navItems" :key="navIdx" :data-idx="navIdx">
            <router-link
              :to="navItem.url"
              class="header-nav__nav__item__link"
              :class="{active: navIdx === activeIdx}"
            >
              {{navItem.text}}
            </router-link>
          </li>
        </ul>
      </scroll-view>
      <div class="header-nav__dropdown" @click="onToggle" v-if="hasDropdown">
        <svg aria-hidden="true" class="header-nav__dropdown__icon">
          <use :xlink:href="showNav ? '#icon-shouqixiao' :'#icon-xialaxiao'" />
        </svg>
      </div>
    </div>
    <div class="header-nav--sub header-nav" v-if="subNavItems.length > 0">
      <scroll-view :scrollX="true" class="header-nav__nav__wrapper">
        <ul class="header-nav__nav" ref="subNav">
          <li class="header-nav__nav__item" v-for="(navItem, navIdx) in subNavItems" :key="navIdx">
            <router-link
              :to="navItem.url"
              class="header-nav__nav__item__link"
              :class="{active: navIdx === subActiveIdx}"
            >
              {{navItem.text}}
            </router-link>
          </li>
        </ul>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import ScrollView from '@/components/ScrollView'

export default {
  components: {
    ScrollView
  },
  props: {
    navItems: {
      type: Array,
      default: () => []
    },
    subNavItems: {
      type: Array,
      default: () => []
    },
    activeIdx: {
      type: Number,
      default: 0
    },
    subActiveIdx: {
      type: Number,
      default: 0
    },
    hasDropdown: {
      type: Boolean,
      default: true
    },
    autoWidth: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      showNav: false,
      navs: []
    }
  },
  methods: {
    setNavWidth (ref) {
      let wrap = this.$refs[ref]
      if (Array.isArray(wrap)) {
        wrap = wrap[0]
      }
      let width = 0
      Array.prototype.forEach.call(wrap.children, child => {
        // get margin-left and margin-right
        let left = getStyleValue(child, 'marginLeft')
        let right = getStyleValue(child, 'marginRight')
        width += child.offsetWidth + left + right
      })
      wrap.style.width = width + 20 + 'px'

      function getStyleValue (el, name) {
        return parseFloat(getComputedStyle(el)[name].match(/\d+/))
      }
    },
    onClick (e) {
      let target = e.target
      if (target.nodeName === 'UL') return
      if (target.nodeName === 'A') {
        target = target.parentNode
      }
      let idx = parseInt(target.dataset.idx)
      let item = this.navItems[idx]
      this.$emit('click', {idx, item})
    },
    onToggle () {
      this.showNav = !this.showNav
      const show = this.showNav
      const activeIdx = this.activeIdx
      const subActiveIdx = this.subActiveIdx
      this.$emit('toggle', {
        show,
        activeIdx,
        subActiveIdx
      })
    }
  },
  mounted () {
    this.navs = this.hasDropdown ? [0, 1] : [0]
    if (this.autoWidth) {
      this.$nextTick(() => {
        if (this.navItems.length) this.setNavWidth('nav')
        if (this.subNavItems.length) this.setNavWidth('subNav')
      })
    }
  }
}
</script>

<style lang="scss">
.header-nav {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 88px;
  line-height: 88px;
  background-color: $c-bg-white;
  &__wrapper {
    position: relative;
    height: 88px;
    background-color: $c-bg-white;
  }
  &__nav {
    height: 100%;
    padding-left: 48px;
    margin: 0;
    list-style: none;
    white-space: nowrap;
    &__wrapper {
      width: 90%;
      height: 100%;
      padding-top: 12px;
      overflow: hidden;
    }
    &__item {
      display: inline-block;
      line-height: 100%;
      margin-right: 40px;
      text-align: center;
      font-size: $t-md;
      &:last-child {
        margin-right: 0;
      }
      &__link {
        display: inline-block;
        text-decoration: none;
        color: #757575;
        padding: 10px;
        padding-top: 0;
        &.active {
          border-bottom: 2px solid $c-t-pink;
          color: $c-t-pink;
        }
      }
    }
  }
  &__dropdown {
    width: 32px;
    height: 100%;
    margin-right: 30px;
    &__icon {
      display: inline-block;
      vertical-align: middle;
      width: 32px;
      height: 100%;
      fill: $c-icon-gray;
    }
  }
}
.header-nav--menu {
  display: block;
  z-index: 1;
  height: auto;
  transition: transform 200ms;
  transform: translateY(-100%);
  .header-nav {
    &__nav {
      width: 100%;
      padding-left: 15px;
      padding-right: 15px;
      white-space: normal;
      &__wrapper {
        width: 100%;
      }
      &__item {
        width: percentage(1/6);
        margin-right: 0;
      }
    }
    &__dropdown {
      width: 100%;
      text-align: center;
      line-height: 43px;
      height: 43px;
    }
  }
}
.header-nav--sub {
  top: 80px;
  background-color: $c-bg-whitef4;
  .header-nav__nav {
    &__wrapper {
      width: 100%;
      padding-top: 0;
    }
  }
}
</style>

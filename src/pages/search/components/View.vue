<template>
  <scroll-view class="result__view" :height="mainHeight" :pullup="true" @scrollToEnd="onPullup">
    <search-nothing v-if="nothing" class="result__view__content"></search-nothing>
    <div class="result__view__content" v-else>
      <slot></slot>
      <search-end v-if="ending"></search-end>
    </div>
  </scroll-view>
</template>

<script>
import SearchEnd from './End'
import SearchNothing from './Nothing'
import ScrollView from '@/components/ScrollView'
import { merge } from 'lodash/object'

export default {
  components: {
    SearchEnd,
    SearchNothing,
    ScrollView
  },
  props: {
    axiosParams: {
      type: Object,
      default: () => {}
    },
    axiosCustom: {
      type: Object,
      default: () => {}
    },
    basename: {
      type: String,
      default: 'type'
    },
    searchType: {
      type: String,
      default: ''
    },
    maxPage: {
      type: Number,
      default: 5
    },
    nothing: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      mainHeight: 0,
      numPages: 5,
      page: 1,
      ending: false
    }
  },
  methods: {
    onPullup () {
      this.loadData()
    },
    isPageEnd () {
      const page = this.page
      return page > this.numPages || page > this.maxPage
    },
    loadData () {
      // limit
      const page = this.page
      if (this.isPageEnd()) {
        this.ending = true
        return
      }
      // main
      const keyword = this.$store.state.searchText
      let params = {keyword, pageSize: 20, page}
      params.search_type = this.searchType
      params.order = 'totalrank'
      let custom = {isSave: true}
      merge(params, this.axiosParams)
      merge(custom, this.axiosCustom)
      this.$axios
        .get(`/api/x/web-interface/search/${this.basename}`, {params, custom})
        .then(resData => {
          this.$emit('update:resData', resData)
          this.numPages = resData.data.numPages
          this.page++
        })
        .catch(res => {
          this.page = page
        })
    }
  },
  mounted () {
    this.loadData()
    this.$bus.$emit('calMainHeight')
    this.mainHeight = this.$bus.data.mainHeight
  }
}
</script>

<style lang="scss">
.result__view__content {
  min-height: 100%;
  background-color: $c-bg-whitef4;
}
</style>

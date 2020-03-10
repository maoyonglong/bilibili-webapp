<template>
  <search-view
    searchType="media_bangumi"
    :nothing="nothing"
    @update:resData="onUpdateResData"
  >
    <div class="search-main-wrapper" style="height: 100%;">
      <fanjv-list :fanjvs="items" />
    </div>
  </search-view>
</template>

<script>
import FanjvList from '../components/Fanjv'
import SearchView from '../components/View'

export default {
  components: {
    SearchView,
    FanjvList
  },
  data () {
    return {
      nothing: false,
      items: []
    }
  },
  methods: {
    onUpdateResData (resData) {
      this.items = this.items.concat(resData.data.result || [])
      if (this.items.length === 0) {
        this.nothing = true
      }
    }
  }
}
</script>

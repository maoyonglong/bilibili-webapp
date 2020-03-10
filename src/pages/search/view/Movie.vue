<template>
  <search-view
    searchType="media_ft"
    :nothing="nothing"
    @update:resData="onUpdateResData"
  >
    <ul class="search-main-wrapper" style="height: 100%;">
      <li class="search-display__item " v-for="(item, idx) in items" :key="idx">
        <div class="search-display__item__left">
          <img v-lazy="item.cover" alt="" class="search-display__item__img">
        </div>
        <div class="search-display__item__right">
          <h3 class="search-display__item__title">{{item.title}}</h3>
          <div class="search-display__item__unit__wrapper">
            <div class="search-display__item__unit">
              <span class="search-display__item__unit__text">地区：</span>
              <span class="search-display__item__unit__text">{{item.areas}}</span>
            </div>
            <div class="search-display__item__unit">
              <span class="search-display__item__unit__text">演员：</span>
              <span class="search-display__item__unit__text">{{item.cv}}</span>
            </div>
            <div class="search-display__item__unit">
              <span class="search-display__item__unit__text">{{item.staff}}</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </search-view>
</template>

<script>
import SearchView from '../components/View'

export default {
  components: {
    SearchView
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

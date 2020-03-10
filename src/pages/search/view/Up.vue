<template>
  <search-view
    searchType="bili_user"
    :nothing="nothing"
    @update:resData="onUpdateResData"
  >
    <ul class="search-main-wrapper">
      <li class="search-display__item " v-for="(item, idx) in items" :key="idx">
        <div class="search-display__item__left">
          <img v-lazy="item.upic" alt="" class="search-display__item__img">
        </div>
        <div class="search-display__item__right">
          <h3 class="search-display__item__title">{{item.uname}}</h3>
          <div class="search-display__item__unit__wrapper">
            <div class="search-display__item__unit">
              <span class="search-display__item__unit__text">粉丝：</span>
              <span class="search-display__item__unit__text">{{item.fans}}</span>
            </div>
            <div class="search-display__item__unit">
              <span class="search-display__item__unit__text">视频：</span>
              <span class="search-display__item__unit__text">{{item.videos}}</span>
            </div>
          </div>
          <p class="up__sign ellipsis">{{item.usign}}</p>
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

<style lang="scss">
.search-display__item {
  &__img {
    display: block;
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
  &__unit__wrapper {
    padding: 24px 0;
  }
}
.up__sign {
  margin: 0;
}
</style>

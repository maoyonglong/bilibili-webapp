<template>
  <ul class="search__fanjv" @click="onClick">
    <li class="search__fanjv__item" v-for="(f, fIdx) in fanjvs" :key="fIdx" :data-idx="fIdx">
      <div class="search__fanjv__item__left">
        <img class="search__fanjv__item__img" v-lazy="f.cover" alt="">
      </div>
      <div class="search__fanjv__item__right">
        <h3 class="search__fanjv__item__kind">
          <img src="//s1.hdslb.com/bfs/static/mult/images/bangumi.png" alt="" class="search__fanjv__item__kind__icon">
          番剧
        </h3>
        <p class="search__fanjv__item__title" v-html="f.title"></p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    fanjvs: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    onClick (e) {
      let target = e.target
      while (target.nodeName !== 'LI') {
        target = target.parentNode
      }
      const idx = target.dataset.idx
      const item = this.fanjvs[idx]
      this.$emit('click', {idx, item})
    }
  }
}
</script>

<style lang="scss">
@import '../common';
.search__fanjv__item {
  display: flex;
  padding: 18px 0;
  &__left {
    margin-right: 24px;
  }
  &__img {
    width: 156px;
    height: 208px;
    border-radius: 10px;
  }
  &__kind {
    display: flex;
    align-items: center;
    font-size: $t-sm;
    &__icon {
      width: 38px;
      height: 100%;
      margin-right: 8px;
    }
  }
}
</style>

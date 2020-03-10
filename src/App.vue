<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
$video-padding--horizontal: 12px;

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
svg {
  width: 100%;
}
body {
  max-height: 100%;
}

a {
  display: block;
  text-decoration: none;
}

ul {
  padding-left: 0;
  margin: 0;
  list-style: none;
}

.recommend {
  overflow: hidden;
  width: 100%;
  padding-top: 24px;
  &__video {
    float: left;
    box-sizing: border-box;
    width: 50%;
    // margin-bottom: 32px;
    &:nth-child(2n) {
      padding-left: $video-padding--horizontal;
    }
    &:nth-child(2n+1) {
      padding-right: $video-padding--horizontal;
    }
  }
}
</style>

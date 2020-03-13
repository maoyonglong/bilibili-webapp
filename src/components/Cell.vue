<template>
  <div class="cell">
    <slot name="left">
      <span class="left" @click="onClick('left')">{{leftText}}</span>
    </slot>
    <slot name="middle">
      <span class="middle" @click="onClick('middle')">{{middleText}}</span>
    </slot>
    <slot name="right">
      <span class="right" @click="onClick('right')">{{rightText}}</span>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    leftText: {
      type: String,
      default: ''
    },
    middleText: {
      type: String,
      default: ''
    },
    rightText: {
      type: String,
      default: ''
    }
  },
  methods: {
    onClick (t) {
      this.$emit('click', t)
    }
  }
}
</script>

<style lang="scss" scoped>
.cell {
  display: flex;
  align-items: center;
  min-height: 88px;
  line-height: 88px;
  padding: 0 24px;
  border: 1px solid $c-b-gray;
  text-align: center;
  background-color: $c-t-white;
  color: $c-t-black1;
}
.left {
  width: 144px;
  font-size: $t-md;
}
.middle {
  flex: 1;
  font-size: $t-lg;
}
.right {
  width: 144px;
  font-size: $t-sm;
  color: $c-t-gray;
}
</style>

<template>
  <!-- <virtual-collection v-bind="options">
    <slot slot="cell" slot-scope="props" :item="props.data">
      {{props}}
    </slot>
  </virtual-collection> -->
  <waterfall v-bind="options">
    <slot></slot>
  </waterfall>
</template>

<script>
// import VirtualCollection from 'vue-virtual-collection'
// import Vue from 'vue'
// Vue.use(VirtualCollection)
import waterfall from 'vue-waterfall2'
import Vue from 'vue'

Vue.use(waterfall)

function validCheck (value, type) {
  if (type === 'Array') {
    return value && Array.isArray(value)
  }
  /* eslint-disable valid-typeof */
  return value && typeof value === type
}

export default {
  props: {
    options: {
      type: Object,
      required: true,
      // validator (opt) {
      //   const {
      //     cellSizeAndPositionGetter,
      //     width,
      //     height,
      //     collection
      //   } = opt
      //   let isValid = validCheck(cellSizeAndPositionGetter, 'function')
      //   isValid = validCheck(width, 'number')
      //   isValid = validCheck(height, 'number')
      //   isValid = validCheck(collection, 'Array')

      //   return isValid
      // }
      validator (opt) {
        const {
          col,
          data
        } = opt
        let isValid = validCheck(col, 'number')
        isValid = validCheck(data, 'Array')

        return isValid
      }
    }
  }
}
</script>

<style>

</style>

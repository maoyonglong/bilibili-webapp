export default
{
  install (Vue, options) {
    const vue = new Vue()
    vue.data = {
      viewData: {default: {}, fanjv: {}, up: {}, movie: {}}
    }
    Vue.prototype.$bus = vue
  }
}

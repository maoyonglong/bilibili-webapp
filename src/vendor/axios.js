/* eslint-disable prefer-promise-reject-errors */
import Factory, { AxiosSugarConfig, AxiosSugarLifeCycle } from 'axios-sugar'
export default
{
  install (Vue, options) {
    const axios = options.axios
    if (!axios) console.error('[axios-sugar]: Please specify an axios instance.')
    Vue.prototype.$axios = options.axios
    let lifecycle = new AxiosSugarLifeCycle()
    lifecycle.beforeResponse(res => {
      if (res.data.code !== 0) {
        return {
          state: false,
          message: 'code is not zero.'
        }
      }
    })
    Factory(axios, {
      config: new AxiosSugarConfig({
        isResend: true,
        isSave: true
      }),
      lifecycle
    })
  }
}

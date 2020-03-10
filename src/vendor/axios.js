/* eslint-disable prefer-promise-reject-errors */
export default
{
  install (Vue, options) {
    const axios = options.axios
    if (!axios) console.error('[axios-sugar]: Please specify an axios instance.')
    Vue.prototype.$axios = options.axios
    const storage = {
      get (symbol, saveType = 'inner') {
        if (saveType === 'inner') {
          const data = this.data
          if (!data) return null
          return data[symbol] || null
        } else if (saveType === 'localStorage') {
          let data = localStorage.getItem(symbol)
          if (data === null) return null

          return data === null ? null : (
            JSON.parse(data)
          )
        }
      },
      set (symbol, resData, saveType = 'inner') {
        if (saveType === 'inner') {
          const data = this.data || {}
          data[symbol] = resData
          this.data = data
        } else if (saveType === 'localStorage') {
          try {
            localStorage.setItem(symbol, JSON.stringify(resData))
          } catch (err) {
            console.error(`[axios-sugar]: ${err.message}`)
          }
        }
      }
    }
    const requests = []
    function notUndef (targetVal, defaultVal) {
      return typeof targetVal === 'undefined' ? defaultVal : targetVal
    }
    function genSybmol (config) {
      let { method, url } = config
      // the data send before
      let data

      // get the sent data
      switch (method) {
        case 'get':
          data = ''
          if (/\?/.test(url)) {
            const part = url.split('?')
            url = part[0]
            data += part[1]
          }
          if (config.params) {
            for (let [key, val] of Object.entries(config.params)) {
              if (data !== '') data += '&'
              data += `${key}=${val}`
            }
          }
          break
        case 'post':
          data = JSON.stringify(config.data)
          break
      }

      return `method=${method}&url=${url}&data=${data}`
    }
    axios.interceptors.request.use(config => {
      if (requests.indexOf(config) >= 0) return Promise.reject({ reason: 'existed' })

      // get custom options
      const custom = config.custom
      let isSave, saveType
      if (custom) {
        isSave = notUndef(custom.isSave, false)
        saveType = notUndef(custom.saveType, 'inner')
      }
      if (isSave) {
        const storeRes = storage.get(genSybmol(config), saveType)
        if (storeRes) return Promise.reject({ reason: 'saved', data: storeRes })
      }

      // send request
      requests.push(config)
      return Promise.resolve(config)
    }, err => {
      Promise.reject(err)
    })
    axios.interceptors.response.use(res => {
      const config = res.config
      const resData = res.data
      const code = resData.code

      if (code !== 0) return Promise.reject(code)

      // get custom option
      const custom = config.custom
      let isSave, saveType
      if (custom) {
        isSave = notUndef(custom.isSave, false)
        saveType = notUndef(custom.saveType, 'inner')
      }

      // generate symbol string
      if (isSave) {
        const symbol = genSybmol(config)
        storage.set(symbol, resData, saveType)
      }

      return Promise.resolve(resData)
    }, err => {
      // custom error
      const reason = err.reason
      if (reason) {
        switch (reason) {
          case 'existed':
            return
          case 'saved':
            return Promise.resolve(err.data)
        }
      }

      const config = err.config
      // axios error
      if (config) {
        // remove this request in requests
        requests.splice(requests.indexOf(config), 1)

        // get custom options
        const custom = config.custom
        let isResend, resendDelay, resendTimes, curResendTimes
        if (custom) {
          isResend = notUndef(custom.isResend, true)
          resendDelay = notUndef(custom.resendDelay, 500)
          resendTimes = notUndef(custom.resendTimes, 3)
          curResendTimes = notUndef(custom.curResendTimes, 0)
        }

        if (isResend && curResendTimes < resendTimes) {
          setTimeout(() => {
            if (!custom) {
              config.custom = {}
            }
            config.custom.curResendTimes = ++curResendTimes
            axios.request(config)
          }, resendDelay)
        } else {
          return Promise.reject(err)
        }
      } else {
        Promise.reject(err)
      }
    })
  }
}

import Vue from 'vue'
import Router from 'vue-router'
const Index = () => import('../pages/index')
const Channel = () => import('../pages/channel')
const Video = () => import('../pages/video')
const Photo = () => import('../pages/photo')
const Search = () => import('../pages/search')
const SearchDefault = () => import('../pages/search/view/Default')
const SearchFanjv = () => import('../pages/search/view/Fanjv')
const SearchUp = () => import('../pages/search/view/Up')
const SearchMovie = () => import('../pages/search/view/Movie')
const PhotoDetail = () => import('../pages/photoDetail')
const Login = () => import('../pages/login')

// routerStack
let routerStack = []
const routerPush = Router.prototype.push
const routerReplace = Router.prototype.replace
const routerBack = Router.prototype.back
Router.prototype.push = function (location) {
  routerStack.push(location)
  return routerPush.call(this, location).catch(error => error)
}
Router.prototype.back = function (num) {
  const len = routerStack.length
  if (len > num) {
    return routerBack.call(this, num).catch(error => error)
  } else {
    // clear and route to the first
    let location = routerStack[0] || {path: '/'}
    routerStack = []
    return routerReplace.call(this, location).catch(error => error)
  }
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'PageLogin',
      component: Login
    },
    {
      path: '/',
      name: 'PageIndex',
      component: Index
    },
    {
      path: '/index',
      redirect: '/'
    },
    {
      path: '/channel/:rid',
      name: 'PageChannel',
      component: Channel
    },
    {
      path: '/video/:aid',
      name: 'PageVideo',
      component: Video
    },
    {
      path: '/search',
      name: 'PageSearch',
      component: Search,
      children: [
        {
          path: 'default',
          name: 'PageSearchDefault',
          component: SearchDefault
        },
        {
          path: 'fanjv',
          name: 'PageSearchFanjv',
          component: SearchFanjv
        },
        {
          path: 'up',
          name: 'PageSearchUp',
          component: SearchUp
        },
        {
          path: 'movie',
          name: 'PageSearchMovie',
          component: SearchMovie
        }
      ]
    },
    {
      path: '/photo',
      name: 'PagePhoto',
      component: Photo
    },
    {
      path: '/photoDetail/:id',
      name: 'PagePhotoDetail',
      component: PhotoDetail
    }
  ]
})

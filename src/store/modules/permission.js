import { constantRoutes } from '@/router'
import Layout from '@/layout'
import store from '@/store'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    const c = {}
    const m = {}
    c.name = tmp.funcName
    c.path = ''
    m.icon = 'component'
    m.title = tmp.funcName
    c.meta = m
    if (tmp.pid === null || tmp.pid === '') {
      c.component = Layout
    } else {
      c.component = loadView(tmp.component)
    }
    if (tmp.children) {
      c.children = filterAsyncRoutes(tmp.children)
    }
    res.push(c)
  })

  return res
}

function loadView(view) {
  return () => import('@/views/dashboard/index')
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(store.getters.empfuns)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

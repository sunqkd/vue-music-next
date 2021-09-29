/*
createLogger 是 vuex 提供的插件
*/
import { createStore, createLogger } from 'vuex'
import state from './state'
import mutations from './mutations'
// 引入整个模块 getters actions
import * as getters from './getters'
import * as actions from './actions'

// 开发环境
const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state,
  getters,
  mutations,
  actions,
  strict: debug, // 严格模式 深度监听state 如果不是提交mutation改变的state，则会警告。性能损耗只在开发环境下开启
  plugins: debug ? [createLogger()] : [] // 开发环境使用 createLogger 插件(打印修改日志) 线上环境则不使用logger插件
})

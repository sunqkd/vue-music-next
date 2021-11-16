import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy'

// 引入全局样式
import '@/assets/scss/index.scss'
import { load, saveAll } from '@/assets/js/array-store'
import { FAVORITE_KEY, PLAY_KEY } from '@/assets/js/constant'
import { processSongs } from '@/service/song'

import loadingDirective from '@/components/base/loading/directive'
import noResultDirective from '@/components/base/no-result/directive'
// 读取列表数据
const favoriteSongs = load(FAVORITE_KEY)
// sessionStorage 中存储的收藏歌曲，会因时间问题，url过期不能正常播放
// 在main.js中重新请求，并初始化，更新数据
if (favoriteSongs.length > 0) {
    processSongs(favoriteSongs).then((songs) => {
        store.commit('setFavoriteList', songs)
        // 存储到session中
        saveAll(songs, FAVORITE_KEY)
    })
}
// 播放历史列表
// 重新加载
const historySongs = load(PLAY_KEY)
if (historySongs.length > 0) {
    processSongs(historySongs).then((songs) => {
        store.commit('setPlayHistory', songs)
        // 存储到session中
        saveAll(songs, PLAY_KEY)
    })
}

createApp(App).use(store).use(router).use(lazyPlugin, {
    loading: require('@/assets/images/default.png')
}).directive('loading', loadingDirective).directive('noResult', noResultDirective).mount('#app')

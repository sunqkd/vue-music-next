// 搜索历史逻辑
import { save, remove, clear } from '@/assets/js/array-store'
import { SEARCH_KEY } from '@/assets/js/constant'
import { useStore } from 'vuex'
export default function useSearchHistory() {
    // 保存搜索记录
    const maxLen = 200
    const store = useStore()
    // 保存记录
    function saveSearch(query) {
        // 向 storage 中保存函数
        const searches = save(query, SEARCH_KEY, (item) => {
            return item === query
        }, maxLen)
        // 向vuex中存储数据
        store.commit('setSearchHistory', searches)
    }
    // 删除记录
    function deleteSearch(query) {
        const searches = remove(SEARCH_KEY, (item) => {
            return item === query
        })
        store.commit('setSearchHistory', searches)
    }
    // 清空记录
    function clearSearch() {
        const searches = clear(SEARCH_KEY)
        // 删除缓存session，同时更新vuex状态
        store.commit('setSearchHistory', searches)
    }

    return {
        saveSearch,
        deleteSearch,
        clearSearch
    }
}

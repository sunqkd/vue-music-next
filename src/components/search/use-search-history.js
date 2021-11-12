// 搜索历史逻辑
import { save } from '@/assets/js/array-store'
import { SEARCH_KEY } from '@/assets/js/constant'
import { useStore } from 'vuex'
export default function useSearchHistory() {
    // 保存搜索记录
    const maxLen = 200
    const store = useStore()

    function saveSearch(query) {
        // 向 storage 中保存函数
        const searches = save(query, SEARCH_KEY, (item) => {
            return item === query
        }, maxLen)
        // 向vuex中存储数据
        store.commit('setSearchHistory', searches)
    }

    return {
        saveSearch
    }
}

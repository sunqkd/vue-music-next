import { useStore } from 'vuex'
import { computed } from 'vue'
import { save, remove } from '@/assets/js/array-store'
import { FAVORITE_KEY } from '@/assets/js/constant'
// 收藏列表
export default function useFavorite() {
    const store = useStore()
    const favoriteList = computed(() => store.state.favoriteList) // 响应式数据
    const maxLen = 100
    // 收藏样式判断
    function getFavoriteIcon(song) {
        return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
    }
    // 辅助函数判断歌曲是否收藏 true 找到了 false 没找到
    function isFavorite(song) {
        return favoriteList.value.findIndex((item) => {
            return item.id === song.id
        }) > -1
    }
    // 收藏按钮点击
    function toggleFavorite(song) {
        let list
        if (isFavorite(song)) {
            // remove
            list = remove(FAVORITE_KEY, compare)
        } else {
            // save
            list = save(song, FAVORITE_KEY, compare, maxLen)
        }
        store.commit('setFavoriteList', list)

        // id 是否相等
        function compare(item) {
            return item.id === song.id
        }
    }

    return {
        getFavoriteIcon,
        toggleFavorite
    }
}

// 播放历史函数
import { useStore } from 'vuex'
import { PLAY_KEY } from '@/assets/js/constant'
import { save } from '@/assets/js/array-store'

export default function usePlayHistory() {
    const store = useStore()
    // 最大保留200首歌
    const maxLen = 200
    // 保存
    function savePlay(song) {
        const songs = save(song, PLAY_KEY, (item) => {
            return item.id === song.id
        }, maxLen)
        store.commit('setPlayHistory', songs)
    }
    return {
        savePlay
    }
}

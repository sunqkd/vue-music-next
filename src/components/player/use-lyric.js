// 获取歌词
import { useStore } from 'vuex'
import { computed, watch } from 'vue'
import { getLyric } from '@/service/song'
export default function useLyric() {
    const store = useStore()
    const currentSong = computed(() => store.getters.currentSong)
    watch(currentSong, async (newSong) => {
        // 不合法歌曲
        if (!newSong.url || !newSong.id) {
            return
        }
        // 前端做缓存处理，保存到song对象当中，如果存在则不需要缓存
        const lyric = await getLyric(newSong)
        store.commit('addSongLyric', {
            song: newSong,
            lyric
        })
    })
}

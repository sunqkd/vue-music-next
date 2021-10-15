// 获取歌词
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'

export default function useLyric() {
    const store = useStore()
    const currentSong = computed(() => store.getters.currentSong)
    const currentLyric = ref(null)
    watch(currentSong, async (newSong) => {
        // 不合法歌曲
        if (!newSong.url || !newSong.id) {
            return
        }
        // 前端做缓存处理，保存到song对象当中，如果存在则不需要缓存
        const lyric = await getLyric(newSong)
        // newSong.lyric = lyric // 用法错误，不能直接修改state中的值，唯一方法提交 mutations
        store.commit('addSongLyric', {
            song: newSong,
            lyric
        })
        // 有待考证
        if (currentSong.value.lyric !== lyric) {
            return
        }
        currentLyric.value = new Lyric(lyric, handleLyric)
    })
    // 辅助函数，当歌曲切换时，调用
    function handleLyric() {
        return 1
    }
}

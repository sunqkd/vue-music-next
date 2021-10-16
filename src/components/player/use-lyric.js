// 获取歌词
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'
import { setTimeout } from 'core-js'

export default function useLyric({ songReady, currentTime }) {
    const store = useStore()
    const currentSong = computed(() => store.getters.currentSong)
    // 当前歌词
    const currentLyric = ref(null)
    // 当前歌词播放行数
    const currentLineNum = ref(0)
    // 滚动使用
    const lyricScrollRef = ref(null)
    const lyricListRef = ref(null)
    watch(currentSong, async (newSong) => {
        // 不合法歌曲
        if (!newSong.url || !newSong.id) {
            return
        }
        // 切歌初始化
        stopLyric()
        currentLyric.value = null
        currentLineNum.value = 0
        // 前端做缓存处理，保存到song对象当中，如果存在则不需要缓存
        // 当快速切换歌曲时，遇到同步行，会依次排队执行
        const lyric = await getLyric(newSong)
        // newSong.lyric = lyric // 用法错误，不能直接修改state中的值，唯一方法提交 mutations
        store.commit('addSongLyric', {
            song: newSong,
            lyric
        })
        // 到此currentSong 已经添加了歌词属性
        // A歌 切换到 B歌  B歌又切换到 C歌  B歌就不用执行了
        // 只要当前歌词：此处有疑问
        if (currentSong.value.lyric !== lyric) {
            return
        }
        // 当前歌词
        currentLyric.value = new Lyric(lyric, handleLyric) // 此处为格式化歌词数据 包括时间
        // console.log(currentLyric.value) // time 为毫秒数
        // 当songReady 为false时无法播放歌词，所以将playLyric导出，在ready函数中再次执行
        if (songReady.value) {
            playLyric()
        }
    })
    // 辅助函数，当歌曲播放时会一直执行，调用，歌词会跳到下一行
    function handleLyric({ lineNum }) {
        currentLineNum.value = lineNum
        // 组件 comp结尾 dom对象 El结尾
        const scrollComp = lyricScrollRef.value
        const listEl = lyricListRef.value
        if (!listEl) {
            return
        }
        if (lineNum > 5) {
            // 行 element
            const lineEl = listEl.children[lineNum - 5]
            scrollComp.scroll.scrollToElement(lineEl, 1000)
        } else {
            scrollComp.scroll.scrollTo(0, 0, 1000)
        }
    }
    // 播放歌词
    function playLyric() {
        const currentLyricVal = currentLyric.value
        if (currentLyricVal) {
            // seek 函数 插件独有的函数
            currentLyricVal.seek(currentTime.value * 1000)
        }
    }
    // 暂停歌词
    function stopLyric() {
        const currentLyricVal = currentLyric.value
        if (currentLyricVal) {
            // seek 函数 插件独有的函数
            currentLyricVal.stop()
        }
    }
    return {
        currentLyric,
        currentLineNum,
        playLyric,
        stopLyric,
        lyricScrollRef,
        lyricListRef
    }
}

// 播放模式的相关逻辑
import { useStore } from 'vuex'
import { computed } from 'vue'
import { PLAY_MODE } from '@/assets/js/constant'
export default function useMode() {
    const store = useStore()
    const playMode = computed(() => store.state.playMode)
    // 播放模式图标
    const modeIcon = computed(() => {
        const playModeVal = playMode.value
        return playModeVal === PLAY_MODE.sequence ? 'icon-sequence'
        : playModeVal === PLAY_MODE.random ? 'icon-random' : 'icon-loop'
    })
    function changeMode() {
        const mode = (playMode.value + 1) % 3 // 0 1 2的值
        store.dispatch('changeMode', mode) // 提交action
    }
    return {
        modeIcon,
        changeMode
    }
}

// mini 播放器 滑动切换
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'

export default function useMiniSlider() {
    const sliderWrapperRef = ref(null)
    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const playList = computed(() => store.state.playList)
    // sliderShow 存在条件 全屏关闭 列表有值
    const sliderShow = computed(() => {
        return !fullScreen.value && !!playList.value
    })
    // v-show 操作的页面, 只执行一次onMounted onUnmounted
    onMounted(() => {
        console.log(132)
    })
    onUnmounted(() => {
        console.log(456)
    })
    return {
        sliderWrapperRef,
        sliderShow
    }
}

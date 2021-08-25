import BScroll from '@better-scroll/core' // 核心滚动
import Slide from '@better-scroll/slide' // slide插件 轮播图
import { onMounted, onUnmounted, ref } from 'vue'

BScroll.use(Slide)

export default function useSlider(wrapperRef) {
    const slider = ref(null)
    const currentPageIndex = ref(0)
    // 轮播图实例化
    onMounted(() => {
        slider.value = new BScroll(wrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: true
        })
        slider.value.on('slideWillChange', (page) => {
            currentPageIndex.value = page.pageX
        })
    })

    // 轮播图卸载
    onUnmounted(() => {
        slider.value.destroy()
    })

    return { slider, currentPageIndex }
}

// 引入核心滚动
import BScroll from '@better-scroll/core'
// 检测dom变化，当滚动高度发生变化时,内容高度大于wrapper高度时，就可以滚动
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, ref } from 'vue'
BScroll.use(ObserveDOM)

export default function useScroll(wrapperRef, options) {
    const scroll = ref(null)
    // dom 节点也是ref类型
    onMounted(() => {
        scroll.value = new BScroll(wrapperRef.value, {
            observeDOM: true,
            ...options
        })
    })

    onUnmounted(() => {
        scroll.value.destroy()
    })
}

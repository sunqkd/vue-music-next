// 引入核心滚动
import BScroll from '@better-scroll/core'
// 检测dom变化，当滚动高度发生变化时,内容高度大于wrapper高度时，就可以滚动
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, ref } from 'vue'
BScroll.use(ObserveDOM)

export default function useScroll(wrapperRef, options, emit) {
    // console.log(emit)
    const scroll = ref(null)
    // dom 节点也是ref类型
    onMounted(() => {
        const scrollVal = scroll.value = new BScroll(wrapperRef.value, {
            observeDOM: true,
            ...options
        })
        // 如果为 3 则可以监听scroll事件
        // 向上滚动y为负数
        if (options.probeType > 0) {
            scrollVal.on('scroll', (pos) => {
                // console.log(pos)
                // 通过事件派发，把滚动位置传递出去
                emit('scroll', pos.y)
            })
        }
    })
    // 卸载销毁
    onUnmounted(() => {
        scroll.value.destroy()
    })
}

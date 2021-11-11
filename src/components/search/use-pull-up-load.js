// 上拉加载
import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import observeDOM from '@better-scroll/observe-dom'
import { ref, onMounted, onUnmounted } from 'vue'

BScroll.use(PullUp)
BScroll.use(observeDOM)
export default function usePullUpLoad(requestData) {
    const scroll = ref(null)
    const rootRef = ref(null)
    // 拉取标志位
    const isPullUpLoad = ref(false)
    // 实例化 better-scroll 组件
    onMounted(() => {
        const scrollVal = scroll.value = new BScroll(rootRef.value, {
            pullUpLoad: true,
            observeDOM: true,
            click: true
        })
        scrollVal.on('pullingUp', pullingUpHandler)
        async function pullingUpHandler() {
            isPullUpLoad.value = true
            // 请求数据
            await requestData()
            // 停止pullUp
            scrollVal.finishPullUp()
            // 刷新
            scrollVal.refresh()
            isPullUpLoad.value = false
        }
    })
    onUnmounted(() => {
        scroll.value.destroy()
    })
    return {
        scroll,
        rootRef,
        isPullUpLoad
    }
}

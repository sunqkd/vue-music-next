// 上拉加载
import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import observeDOM from '@better-scroll/observe-dom'
import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'

BScroll.use(PullUp)
BScroll.use(observeDOM)
export default function usePullUpLoad(requestData, preventPullUpLoad) {
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
            if (preventPullUpLoad.value) {
                scrollVal.finishPullUp()
                return
            }
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
    // keep-alive
    onActivated(() => {
        scroll.value.enable()
        scroll.value.refresh()
    })
    onDeactivated(() => {
        scroll.value.disable()
    })
    return {
        scroll,
        rootRef,
        isPullUpLoad
    }
}

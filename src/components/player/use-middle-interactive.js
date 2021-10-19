// cd 和 歌词切换
import { ref } from 'vue'
export default function useMiddleInteractive() {
    // 默认显示为 cd 按钮 为过程变量
    const currentShow = ref('cd')
    // middle-l  middle-r
    const middleLStyle = ref(null)
    const middleRStyle = ref(null)
    // 记录变量
    const touch = { }
    // 当前显示 默认 cd 为最终状态变量
    let currentView = 'cd'
    function onMiddleTouchStart(e) {
        // 开始点击的x方向的坐标
        touch.startX = e.touches[0].pageX
        touch.startY = e.touches[0].pageY
        touch.directionLocked = '' // 方向锁
    }

    function onMiddleTouchMove(e) {
        // 偏移量
        const deltaX = e.touches[0].pageX - touch.startX
        const deltaY = e.touches[0].pageY - touch.startY
        // 取偏移量的绝对值
        const absDeltaX = Math.abs(deltaX)
        const absDeltaY = Math.abs(deltaY)
        // h 横向滑动 v 纵向滑动 仍然有 斜着的bug
        if (!touch.directionLocked) {
            touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
        }
        // 纵向偏移大于横向偏移则，置返回横向偏移不在执行
        if (touch.directionLocked === 'v') { // 纵向偏移
            return
        } else {
            // 点击处为text文字，停止父scroll的行为事件，cd Dom上
            e.stopPropagation()
        }

        const left = currentView === 'cd' ? 0 : -window.innerWidth
        // 偏移宽度 并控制范围 [0, -window.innerWidth] 之间
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        // 计算偏移比例
        touch.percent = Math.abs(offsetWidth / window.innerWidth)
        // 从右向左滑 显示为cd
        if (currentView === 'cd') {
            if (touch.percent > 0.2) {
                currentShow.value = 'lyric'
            } else {
                currentShow.value = 'cd'
            }
        // 从左向右滑
        } else {
            if (touch.percent < 0.8) {
                currentShow.value = 'cd'
            } else {
                currentShow.value = 'lyric'
            }
        }
        // 修改cd透明度 0(完全透明) 1(完全不透明)
        middleLStyle.value = {
            opacity: 1 - touch.percent,
            transitionDuration: '0ms' // 此处为touceend的初始化，并不是设置效果 0ms
        }
        // 偏移量
        middleRStyle.value = {
            transform: `translate3d(${offsetWidth}px, 0, 0)`,
            transitionDuration: '0ms' // 此处为touceend的初始化，并不是设置效果 0ms
        }
    }

    function onMiddleTouchEnd() {
        let offsetWidth
        let opacity
        // 松开手指到达最终状态
        if (currentShow.value === 'cd') {
            currentView = 'cd'
            offsetWidth = 0
            opacity = 1
        } else {
            currentView = 'lyric'
            offsetWidth = -window.innerWidth
            opacity = 0
        }
        const duration = 300
        // 修改cd透明度
        middleLStyle.value = {
            opacity,
            transitionDuration: `${duration}ms`
        }
        // 偏移量
        middleRStyle.value = {
            transform: `translate3d(${offsetWidth}px,0,0)`,
            transitionDuration: `${duration}ms`
        }
    }

    return {
        currentShow,
        middleLStyle,
        middleRStyle,
        onMiddleTouchStart,
        onMiddleTouchMove,
        onMiddleTouchEnd
    }
}

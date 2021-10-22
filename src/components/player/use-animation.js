import { ref } from 'vue'
import animations from 'create-keyframe-animation'
export default function useAnimation() {
    // 进入动画，离开动画
    const cdWrapperRef = ref(null)
    // 标识位： 进入动画还未结束，就去执行结束动画
    // 或者结束动画还未结束，就去执行进入动画, 未执行done函数，无法下一步
    let entering = false
    let leaving = false

    // 当只用 JavaScript 过渡的时候，在 enter 和 leave 钩中必须使用 done 进行回调
    // 进入
    function enter(el, done) {
        if (leaving) {
            afterEnter()
        }
        entering = true
        const { x, y, scale } = getPosAndScale()
        const animation = {
            // 从此位置进入
            0: {
                transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
            },
            // 最终状态 此位置结束
            100: {
                transform: 'translate3d(0,0,0) scale(1)'
            }
        }
        // 注册动画
        animations.registerAnimation({
            name: 'move',
            animation,
            presets: {
                duration: 600,
                easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
            }
        })
        animations.runAnimation(cdWrapperRef.value, 'move', done)
    }
    // 进入结束
    function afterEnter() {
        entering = false
        animations.unregisterAnimation('move')
        cdWrapperRef.value.animation = ''
    }

    // 离开动画
    function leave(el, done) {
        if (entering) {
            afterEnter()
        }
        leaving = true
        const { x, y, scale } = getPosAndScale()
        const cdWrapperEl = cdWrapperRef.value
        cdWrapperEl.style.transition = 'all 0.6s cubic-bezier(0.45, 0, 0.55, 1)'
        cdWrapperEl.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`
        // 绑定动画结束事件
        cdWrapperEl.addEventListener('transitionend', next)
        function next() {
            done()
            // 解绑事件
            cdWrapperEl.removeEventListener('transitionend', next)
        }
    }

    // 离开完成
    function afterLeave() {
        leaving = false
        const cdWrapperEl = cdWrapperRef.value
        cdWrapperEl.style.transition = ''
        cdWrapperEl.style.transform = ''
    }

    function getPosAndScale() {
        const targetWidth = 40 // mini 小圆宽
        const paddingLeft = 40 // 半径 + 左边padding
        const paddingBottom = 30 // 半径 + 距离底部的值
        const paddingTop = 80 // 大圆距离顶部的距离
        const width = window.innerWidth * 0.8 // 大圆的宽度

        // 计算 x坐标偏移量
        // 大圆到小圆 向左偏移，应该为负值
        const x = -(window.innerWidth / 2 - paddingLeft)
        // y轴偏移为正值
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        // 缩放比例
        const scale = targetWidth / width
        return {
            x,
            y,
            scale
        }
    }

    return {
        cdWrapperRef,
        enter,
        afterEnter,
        leave,
        afterLeave
    }
}

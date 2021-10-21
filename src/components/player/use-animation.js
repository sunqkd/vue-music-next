import { ref } from 'vue'
import animations from 'create-keyframe-animation'
export default function useAnimation() {
    // 进入动画，离开动画
    const cdWrapperRef = ref(null)
    function enter() {
        const { x, y, scale } = getPosAndScale()
        const animation = {
            0: {
                transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
            },
            // 最终状态
            100: {
                transform: 'translate3d(0,0,0) scale(1)'
            }
        }
        // 注册动画
        animations.registerAnimation({
            name:'move',
            animation,
            presets: {
                duration: 600,
                easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
            }
        })
        animations.runAnimation(cdWrapperRef.value,'move')
    }
    function afterEnter() {

    }
    function leave() {

    }
    function afterLeave() {

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

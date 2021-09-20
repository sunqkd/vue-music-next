import { ref, computed } from 'vue'

export default function useShortcut(props, groupRef) {
    const scrollRef = ref(null) // ref
    const ANCHOR_HEIGHT = 18 // 字母表单个高度
    // 所有字母表
    const shortcutList = computed(() => {
        return props.data.map((item) => {
            return item.title
        })
    })
    const touch = { }
    // start
    function onShortcutTouchStart(e) {
        // 记录点击的纵坐标
        touch.y1 = e.touches[0].pageY
        // 获取点击 index 通过dataset的方式 阻止冒泡和默认行为
        const anchorIndex = parseInt(e.target.dataset.index)
        // console.log(anchorIndex)
        touch.anchorIndex = anchorIndex // 开始索引
        // // 获取需要滚动到的元素DOM
        // const targetEl = groupRef.value.children[anchorIndex]
        // const scroll = scrollRef.value.scroll // better-scroll实例
        // scroll.scrollToElement(targetEl, 0) // 页面滚动事件
        // 滚动到既定的DOM元素
        ScrollTo(anchorIndex)
    }
    // move
    function onShortcutTouchmove(e) {
        touch.y2 = e.touches[0].pageY
        // 利用位置算索引的增加值
        const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0 // 计算两者差值  整数向下取整的写法 和 Math.floor()相同
        // 计算目标索引
        const anchorEndIndex = touch.anchorIndex + delta
        ScrollTo(anchorEndIndex)
    }
    // 滚动到目标元素方法封装
    function ScrollTo(index) {
        // 为点击到字母而发生的拖动行为，直接return，视为无效行为
        if (isNaN(index)) {
            return
        }
        // index 要在字母表模块之内
        index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
        // 获取需要滚动到的元素DOM
        const targetEl = groupRef.value.children[index]
        const scroll = scrollRef.value.scroll // better-scroll实例
        scroll.scrollToElement(targetEl, 0) // 页面滚动事件
    }

    // end
    function onShortcutTouchend(e) {
        // console.log(e)
    }

    return {
        shortcutList,
        onShortcutTouchStart,
        onShortcutTouchmove,
        onShortcutTouchend,
        scrollRef
    }
}

import { ref, computed } from 'vue'

export default function useShortcut(props, groupRef) {
    const scrollRef = ref(null)
    // 所有字母表
    const shortcutList = computed(() => {
        return props.data.map((item) => {
            return item.title
        })
    })
    // start
    function onShortcutTouchStart(e) {
        // 获取点击 index 通过dataset的方式 阻止冒泡和默认行为
        const anchorIndex = parseInt(e.target.dataset.index)
        // 获取需要滚动到的元素DOM
        const targetEl = groupRef.value.children[anchorIndex]
        const scroll = scrollRef.value.scroll // better-scroll实例
        scroll.scrollToElement(targetEl, 0)
    }
    // move
    function onShortcutTouchmove(e) {
        // console.log(e)
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

import { ref, watch, nextTick, computed } from 'vue'
export default function useFixed(props) {
    const groupRef = ref(null)
    const listHeight = ref([]) // 模块区间数据
    const scrollY = ref(0) // 纵向滚动距离
    const currentIndex = ref(0) // 滚动到的当前模块
    const distance = ref(0) // 当前组top与scrollY比较的差值
    const TITLE_HEIGHT = 30 // 高度常量
    // 当前模块标题
    const fixedTitle = computed(() => {
        if (scrollY.value < 0) {
            return ''
        }
        const currentGroup = props.data[currentIndex.value]
        return currentGroup ? currentGroup.title : ''
    })

    // 监听 props中data的变化，而dom变化是在nextTick之后, compositionApi 在setUp中访问不到 this对象
    watch(() => props.data, async() => {
        await nextTick()
        calculate()
    })

    const fixedStyle = computed(() => {
        const distanceVal = distance.value
        // console.log(distanceVal)
        const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0
        // x,y,z的偏移量
        // console.log(diff)
        return {
            transform: `
                translate3d(0,${diff}px,0)
            `
        }
    })

    // 监听滚动Y值变化
    watch(scrollY, (newY, oldY) => {
        const listHeightsVal = listHeight.value // 模块区间间隔, 数量比模块个数多1
        for (let i = 0; i < listHeightsVal.length - 1; i++) {
            const heightTop = listHeightsVal[i] // 模块顶部高度
            const heightBottom = listHeightsVal[i + 1] // 模块底部高度
            if (newY >= heightTop && newY < heightBottom) {
                // 在某个模块的区间内
                currentIndex.value = i
                distance.value = heightBottom - newY // 求得当前组与滚动距离的差值
            }
        }
    })

    // 当dom发生变化后，计算模块高度并累计加总
    function calculate() {
        const list = groupRef.value.children
        const listHeightsVal = listHeight.value
        let height = 0
        listHeightsVal.length = 0 // 数组清空
        listHeightsVal.push(height) // 放入初始值0
        for (let i = 0; i < list.length; i++) {
            // 模块高度累加
            height += list[i].clientHeight
            listHeightsVal.push(height)
        }
    }

    // 派发的事件接受滚动位置
    function onScroll(data) {
        scrollY.value = -data
        // console.log(data)
    }

    return {
        groupRef,
        onScroll,
        fixedTitle,
        fixedStyle
    }
}

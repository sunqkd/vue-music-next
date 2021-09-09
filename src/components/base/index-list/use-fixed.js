import { ref, watch, nextTick } from 'vue'
export default function useFixed(props) {
    const groupRef = ref(null)
    const listHeight = ref([])
    // 监听 props中data的变化，而dom变化是在nextTick之后, compositionApi 在setUp中访问不到 this对象
    watch(() => props.data, async() => {
        await nextTick()
        calculate()
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

    return {
        groupRef
    }
}

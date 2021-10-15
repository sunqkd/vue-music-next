// 控制 cd 钩子函数
import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'
export default function useCd() {
    const store = useStore()
    const playing = computed(() => store.state.playing)
    const cdRef = ref(null)
    const cdImageRef = ref(null)

    const cdCls = computed(() => {
        return playing.value ? 'playing' : ''
    })

    // 暂停的时候 同步旋转角度
    watch(playing, (newPlaying) => {
        // 暂停
        if (!newPlaying) {
            syncTransform(cdRef.value, cdImageRef.value)
        }
    })
    // 同步选装角度 外层容器 内层图片
    function syncTransform(wrapper, inner) {
        const wrapperTransform = getComputedStyle(wrapper).transform // 外层初始偏移量
        const innerTransform = getComputedStyle(inner).transform
        // console.log(typeof innerTransform) // string 字符串拼接 旋转叠加
        wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform)
    }

    return {
        cdCls,
        cdRef,
        cdImageRef
    }
}

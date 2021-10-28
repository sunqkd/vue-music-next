// 高阶 scroll组件
import { h, mergeProps, withCtx, renderSlot, ref, computed, watch, nextTick } from 'vue'
import Scroll from '@/components/base/scroll/scroll'
import { useStore } from 'vuex'

export default {
    name: 'wrap-scroll',
    props: Scroll.props,
    emits: Scroll.emits,
    // ctx 上下文 没用到模板， 使用render函数实现
    render(ctx) {
        return h(Scroll, mergeProps({ ref: 'scrollRef' }, ctx.$props, {
            onScroll: (e) => {
                ctx.$emit('scroll', e)
            }
        }), {
            default: withCtx(() => {
                return [renderSlot(ctx.$slots, 'default')]
            })
        })
    },
    setup() {
        const scrollRef = ref(null)
        // 利用计算属性做延时
        const scroll = computed(() => {
            return scrollRef.value.scroll
        })
        const store = useStore()
        const playList = computed(() => store.state.playList)
        // 歌曲列表变更，更新（重新计算滚动高度）
        watch(playList, async() => {
            await nextTick()
            scroll.value.refresh()
        })
        return {
            scrollRef,
            scroll
        }
    }
}

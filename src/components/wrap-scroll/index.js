// 高阶 scroll组件
import { h, mergeProps, withCtx, renderSlot, ref } from 'vue'
import Scroll from '@/components/base/scroll/scroll'

export default {
    name: 'wrap-scroll',
    props: Scroll.props,
    emits: Scroll.emits,
    // ctx 上下文
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
        return {
            scrollRef
        }
    }
}

<template>
    <div ref="rootRef">
        <slot></slot>
    </div>
</template>
<script>
import useScroll from './useScroll'
import { ref } from 'vue'
export default {
    name: 'scroll',
    props: {
        click: {
            type: Boolean,
            default: true
        },
        probeType: {
            type: Number,
            default: 0
        }
    },
    // 派发事件，数组中为事件的名称
    emits: ['scroll'],
    // componsition API  第二个参数是个对象
    setup(props, { emit }) {
        const rootRef = ref(null)
        const scroll = useScroll(rootRef, props, emit)
        return {
            rootRef,
            scroll
        }
    }
}
</script>

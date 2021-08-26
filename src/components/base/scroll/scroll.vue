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
        }
    },
    // componsition API
    setup(props) {
        const rootRef = ref(null)
        useScroll(rootRef, props)
        return {
            rootRef
        }
    }
}
</script>

import { computed } from 'vue'

export default function useShortcut(props) {
    const shortcutList = computed(() => {
        return props.data.map((item) => {
            return item.title
        })
    })

    return {
        shortcutList
    }
}

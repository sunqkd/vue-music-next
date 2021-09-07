import { createApp } from 'vue'
import Loading from './loading'
const loadingDirective = {
    // 在绑定元素的父组件被挂载后调用
    // 参数el 就是指令 挂载的Dom节点 binging.value 为值
    mounted(el, binding) {
        // console.log(el)
        // console.log(binding)
        const app = createApp(Loading)
        const instance = app.mount(document.createElement('div')) // 保存实例instance
        // console.log(instance.$el)
        el.instance = instance
        if (binding.value) {
            append(el)
        }
    },
    // 组件更新的时候
    updated(el, binding) {
        if (binding.value !== binding.oldValue) {
            binding.value ? append(el) : remove(el)
        }
    }
}

// 增加子节点
function append(el) {
    el.appendChild(el.instance.$el)
}
// 删除子结点
function remove(el) {
    el.removeChild(el.instance.$el)
}

export default loadingDirective

import { createApp } from 'vue'
import Loading from './loading'
import { addClass, removeClass } from '@/assets/js/dom'
const relativeClass = 'g-relative' // base.scss中有定义

const loadingDirective = {
    // 在绑定元素的父组件被挂载后调用
    // 参数el 就是指令 挂载的Dom节点 binging.value 为值
    mounted(el, binding) {
        // console.log(el)
        // console.log(binding)
        const app = createApp(Loading)
        const instance = app.mount(document.createElement('div')) // 保存实例instance
        // console.log(instance)
        // console.log(instance.$el)
        el.instance = instance
        const title = binding.arg
        if (typeof title !== 'undefined') {
            instance.setTitle(title)
        }
        if (binding.value) {
            append(el)
        }
    },
    // 组件更新的时候
    updated(el, binding) {
        const title = binding.arg
        if (typeof title !== 'undefined') {
            el.instance.setTitle(title)
        }
        if (binding.value !== binding.oldValue) {
            binding.value ? append(el) : remove(el)
        }
    }
}

// 增加子节点
function append(el) {
    const style = getComputedStyle(el) // 获取样式
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
        addClass(el, relativeClass)
    }
    el.appendChild(el.instance.$el)
}
// 删除子结点
function remove(el) {
    removeClass(el, relativeClass)
    el.removeChild(el.instance.$el)
}

export default loadingDirective

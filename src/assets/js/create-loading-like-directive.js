// 相似的功能封装函数
// 创造一个像loading一样的指令
import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'
const relativeClass = 'g-relative' // base.scss中有定义

/*
传入loading组件则创建v-loading指令
传入no-result组件则创建v-noResult指令
*/
export default function createLoadingLikeDirective(Comp) {
    // name为组件中的name值
    const name = Comp.name
    return {
        // 在绑定元素的父组件被挂载后调用
        // 参数el 就是指令 挂载的Dom节点 binging.value 为值
        mounted(el, binding) {
            // console.log(el)
            // console.log(binding)
            const app = createApp(Comp)
            const instance = app.mount(document.createElement('div')) // 保存实例instance
            // console.log(instance)
            // console.log(instance.$el)
            // 不同的组件容易发生指向错误废弃此种写法
            // el.instance = instance
            // const name = Comp.name
            if (!el[name]) { // 初始化一个空对象
                el[name] = { }
            }
            // 把实例绑定到各自的name上，不出现覆盖的情况
            el[name].instance = instance
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
            // const name = Comp.name
            if (typeof title !== 'undefined') {
                el[name].instance.setTitle(title)
            }
            if (binding.value !== binding.oldValue) {
                binding.value ? append(el) : remove(el)
            }
        }
    }
    // 增加子节点
    function append(el) {
        const style = getComputedStyle(el) // 获取样式
        // const name = Comp.name
        if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
            addClass(el, relativeClass)
        }
        el.appendChild(el[name].instance.$el)
    }
    // 删除子结点
    function remove(el) {
        // const name = Comp.name
        removeClass(el, relativeClass)
        // 删除节点要保证删除的一致
        el.removeChild(el[name].instance.$el)
    }
}

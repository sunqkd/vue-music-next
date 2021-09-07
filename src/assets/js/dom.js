// 增加样式
export function addClass(el, className) {
    if (!el.classList.contains(className)) {
        el.classList.add(className)
    }
}
// 删除样式
export function removeClass(el, className) {
    el.classList.remove(className)
}

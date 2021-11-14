// 数据向本地存储中存储 封装成通用的方法
import storage from 'good-storage'

// 保存辅助函数
function insertArray(arr, val, compare, maxLen) {
    // compare为自定义的函数
    const index = arr.findIndex(compare)
    if (index > -1) { // 已经存在
        return
    }
    arr.unshift(val) // 数组之前插入
    if (maxLen && arr.length > maxLen) {
        // 如果数组长度 大于设定的长度，把最先前收藏的删除掉，保持先进先出的队列结构
       arr.pop()
    }
}
// 保存
export function save(item, key, compare, maxLen) {
    // item 要保存的数据 key 键名 compare 为比对函数 maxLen 保存的最大长度
    // 获取key存储，若不存在则为空数组
    const items = storage.session.get(key, [])
    insertArray(items, item, compare, maxLen)
    // 保存到sessionstorage中
    storage.session.set(key, items)
    return items
}

// 删除辅助函数
function deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare)
    if (index > -1) { // 已经存在
        arr.splice(index, 1)
    }
}

// 移除
export function remove(key, compare) {
    const items = storage.session.get(key, [])
    deleteFromArray(items, compare)
    storage.session.set(key, items)
    return items
}

// 初始化收藏列表
export function load(key) {
    return storage.session.get(key, [])
}

// 清空数据
export function clear(key) {
    storage.session.remove(key)
    return []
}

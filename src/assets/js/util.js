// 洗牌算法
export function shuffle(source) {
    // source参数为 原数组
    // 注：习惯性不要对原数组进行修改，返回新的数组
    const arr = source.slice() // 生成新数组 不影响原数组
    for (let i = 0; i < arr.length; i++) {
        const j = getRandomInt(i)
        swap(arr, i, j)
    }
    return arr
}
// 求 0-max 之间的随机数
function getRandomInt(max) {
    // 范围在 [0,1) => [0,max+1) => [0,max] 之间
    return Math.floor(Math.random() * (max + 1))
}
// 交换函数
function swap(arr, i, j) {
    const t = arr[i]
    arr[i] = arr[j]
    arr[j] = t
}
// 格式化时间
export function formatTime(interval) {
    interval = interval | 0 // 向下取整
    // /60 并向下取整得到分钟部分，转换成字符串，调用padStart函数，保留两位，不足两位前面填充零
    const minute = ((interval / 60 | 0) + '').padStart(2, '0') // 分钟
    const second = (interval % 60 + '').padStart(2, '0') // 秒
    return `${minute}:${second}`
}

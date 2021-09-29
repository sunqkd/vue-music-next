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

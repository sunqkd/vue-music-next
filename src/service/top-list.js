// 排行接口数据
import { get } from './base'
export function getTopList() {
    return get('/api/getTopList')
}
// 排行详情接口
export function getTopDetail(top) {
    return get('/api/getTopDetail', {
        id: top.id,
        period: top.period
    })
}

// base 中有命名为 get 的export
import { get } from './base'
// 获取推荐列表
export function getRecommend() {
    return get('/api/getRecommend')
}
// 获取推荐专辑接口
export function getAlbum(album) {
    return get('/api/getAlbum', {
        id: album.id
    })
}

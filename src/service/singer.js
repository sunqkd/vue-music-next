import { get } from './base'
// 获取歌手列表
export function getSingerList() {
    return get('/api/getSingerList')
}

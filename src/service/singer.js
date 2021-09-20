import { get } from './base'
// 获取歌手列表
export function getSingerList() {
    return get('/api/getSingerList')
}

// 注意 传入一个query参数mid 获取歌手详情
export function getSingerDetail(singer) {
    return get('/api/getSingerDetail', {
        mid: singer.mid
    })
}

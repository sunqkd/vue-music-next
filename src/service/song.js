import { get } from './base'
// songs 为歌手歌曲数组
// 为歌手歌曲添加url 并过滤处理数据
export function processSongs(songs) {
    if (!songs.length) {
        // 转化为Promise对象，从而控制异步流程
        return Promise.resolve(songs)
    }
    return get('/api/getSongsUrl', {
        mid: songs.map((song) => {
            return song.mid
        })
    }).then((result) => {
        const map = result.map
        return songs.map((song) => {
            song.url = map[song.mid]
            return song // 给歌曲添加url
        }).filter((song) => { // 过滤数据只有含有vkey字符串的歌曲地址才能播放
            return song.url.indexOf('vkey') > -1
        })
    })
}

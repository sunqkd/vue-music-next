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
            return song.url && song.url.indexOf('vkey') > -1
        })
    })
}

// 保存请求过的歌词
const lyricMap = {}
// 获取歌词接口
export function getLyric(song) {
    // 优先从歌曲本身找
    if (song.lyric) {
        return Promise.resolve(song.lyric)
    }
    const mid = song.mid
    // 次之 从lyric存储中去找
    const lyric = lyricMap[mid]
    if (lyric) {
        return Promise.resolve(lyric)
    }
    // 找不到则发从请求
    return get('/api/getLyric', {
        mid
    }).then((result) => {
        // 获得的歌词为字符串类型
        const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
        lyricMap[mid] = lyric // 存储到对象中下次使用
        return lyric
    })
}

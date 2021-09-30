import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'
// 选择播放
export function selectPlay({ commit }, { list, index }) {
    commit('setPlayMode', PLAY_MODE.sqeuence) // 顺序播放模式
    commit('setSquenceList', list) // 歌曲列表原始数据
    commit('setPlayingState', true) // 播放状态
    commit('setFullScreen', true) // 全屏播放
    commit('setPlayList', list) // 播放列表 默认和歌曲列表相同
    commit('setCurrentIndex', index) // 播放索引
}

// 随机播放
// 不需要索引，随机列表的第一首歌，就可以是播放的歌曲
export function randomPlay({ commit }, list) {
    // 对list进行洗牌
    commit('setPlayMode', PLAY_MODE.random) // 随机播放模式
    commit('setSquenceList', list) // 歌曲列表原始数据
    commit('setPlayingState', true) // 播放状态
    commit('setFullScreen', true) // 全屏播放
    commit('setPlayList', shuffle(list)) // 播放列表 默认和歌曲列表相同
    commit('setCurrentIndex', 0) // 播放索引 不需要传参数 0即可
}
